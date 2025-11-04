import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import { getUserInfo } from "@/services/user";
import { decreaseCredits, CreditsTransType } from "@/services/credit";
import Replicate from "replicate";
import { extractImageUrl, isValidImageUrl, createImageResult, handleReplicateError } from "@/lib/replicate-utils";
import { AI_WORKSTATION_CONFIG } from "@/config/ai-workstation";

// 初始化Replicate客户端
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const userInfo = await getUserInfo();
    if (!userInfo || !userInfo.email) {
      return respErr("用户未登录");
    }

    const body = await req.json();
    const { 
      prompt, 
      images = [], 
      model = "Pro", 
      aspectRatio = "1:1", 
      imageCount = 1,
      watermark = true 
    } = body;

    // 输入验证
    if (typeof prompt !== 'string' && prompt !== undefined) {
      return respErr("提示词必须是字符串");
    }
    
    if (!Array.isArray(images)) {
      return respErr("图像数据格式无效");
    }
    
    if (!AI_WORKSTATION_CONFIG.api.supportedModels.includes(model as any)) {
      return respErr("无效的模型类型");
    }
    
    if (!AI_WORKSTATION_CONFIG.api.supportedAspectRatios.includes(aspectRatio as any)) {
      return respErr("无效的纵横比");
    }
    
    if (!Number.isInteger(imageCount) || imageCount < 1 || imageCount > AI_WORKSTATION_CONFIG.api.maxImageCount) {
      return respErr(`图像数量必须是1-${AI_WORKSTATION_CONFIG.api.maxImageCount}之间的整数`);
    }

    // 清理和截断提示词
    const sanitizedPrompt = prompt ? prompt.trim().substring(0, AI_WORKSTATION_CONFIG.api.maxPromptLength) : "";

    if (sanitizedPrompt.length > AI_WORKSTATION_CONFIG.api.maxPromptLengthWarning) {
      console.warn(`Prompt truncated to ${AI_WORKSTATION_CONFIG.api.maxPromptLengthWarning} characters`);
    }

    if (!sanitizedPrompt && images.length === 0) {
      return respErr("请提供提示词或上传图像");
    }

    // 计算所需积分
    const totalCost = imageCount * AI_WORKSTATION_CONFIG.api.creditsPerImage;
    
    // 获取用户当前积分
    const { getUserCredits } = await import("@/services/credit");
    let userCredits;
    try {
      userCredits = await getUserCredits(userInfo.uuid);
    } catch (error) {
      console.error("Failed to get user credits:", error);
      return respErr("无法获取用户积分信息，请稍后重试");
    }

    // 检查积分是否足够
    if (userCredits.left_credits < totalCost) {
      return respErr(`积分不足。生成${imageCount}张图像需要${totalCost}积分，您当前有${userCredits.left_credits}积分`);
    }

    // 扣除用户积分
    let remainingCredits = 0;
    try {
      await decreaseCredits({
        user_uuid: userInfo.uuid,
        trans_type: CreditsTransType.AIWorkstation,
        credits: totalCost,
      });
      
      // 计算扣除后的剩余积分
      remainingCredits = userCredits.left_credits - totalCost;
    } catch (error) {
      console.error("Failed to decrease credits:", error);
      return respErr("积分扣除失败，请稍后重试");
    }

    // 准备输入参数
    const input: any = {
      prompt: sanitizedPrompt || "turn blue，Enhance and improve this image",
      output_format: "jpg"
    };

    // 只有当有图像时才添加input_image字段
    if (images.length > 0 && images[0].src) {
      // 验证URL格式和安全性
      try {
        const imageUrl = images[0].src;
        
        // 检查是否为blob URL（客户端上传的文件）
        if (imageUrl.startsWith('blob:')) {
          console.warn("Cannot use blob URLs in server-side API call");
        } else {
          const url = new URL(imageUrl);
          
          // 仅允许 https 协议，除非在开发环境
          const isHttpsOrDevHttp = url.protocol === 'https:' || 
            (process.env.NODE_ENV === 'development' && url.protocol === 'http:');
            
          if (isHttpsOrDevHttp && imageUrl.length < AI_WORKSTATION_CONFIG.security.maxImageUrlLength) {
            // 域名白名单检查
            const isAllowedDomain = AI_WORKSTATION_CONFIG.security.allowedImageDomains.some(domain => 
              url.hostname.endsWith(domain)
            );
            
            if (isAllowedDomain || process.env.NODE_ENV === 'development') {
              input.input_image = imageUrl;
            } else {
              console.warn("Image URL domain not in whitelist:", url.hostname);
            }
          } else {
            console.warn("Invalid image URL protocol or length:", imageUrl);
          }
        }
      } catch (error) {
        console.warn("Invalid image URL format:", images[0].src);
      }
    }

    // 如果没有有效的图像URL，使用默认提示
    if (!input.input_image) {
      input.prompt = (sanitizedPrompt || "Generate a creative image") + " (no input image provided)";
    }

    // Log only non-sensitive information for debugging
    console.log("Replicate API call initiated with model:", model || "flux-kontext-max");

    // 调用Replicate API
    let output: any;
    try {
      console.log("🚀 调用Replicate API...");
      output = await replicate.run("black-forest-labs/flux-kontext-max", { input });
      console.log("✅ Replicate API调用成功:", output);
    } catch (error) {
      console.error("❌ Replicate API error:", error);
      // 如果API调用失败，退还积分
      try {
        const { increaseCredits } = await import("@/services/credit");
        await increaseCredits({
          user_uuid: userInfo.uuid,
          trans_type: "refund",
          credits: totalCost,
          order_no: "",
        });
        console.log("✅ 积分已退还");
      } catch (refundError) {
        console.error("❌ 退还积分失败:", refundError);
      }
      return respErr(handleReplicateError(error));
    }

    // 使用工具函数提取图片URL
    const imageUrl = extractImageUrl(output);
    console.log("📸 提取到的图片URL:", imageUrl);

    // 验证图片URL是否有效
    if (!imageUrl || !isValidImageUrl(imageUrl)) {
      console.warn("⚠️ 图片URL无效，使用备用图片");
      const fallbackUrl = AI_WORKSTATION_CONFIG.fallbackImages.apiFallback;
      
      const resultImages = Array.from({ length: imageCount }).map((_, index) => 
        createImageResult(fallbackUrl, prompt, model, aspectRatio)
      );

      console.log("🎉 使用备用图片完成");
      return respData({
        success: true,
        results: resultImages,
        creditUsed: totalCost,
        remainingCredits: remainingCredits,
        note: "使用备用图片（原始生成失败）"
      });
    }

    // 创建图片结果对象
    const resultImages = Array.from({ length: imageCount }).map((_, index) => 
      createImageResult(imageUrl, prompt, model, aspectRatio)
    );

    console.log("🎉 生成完成，返回结果:", {
      success: true,
      imageCount: resultImages.length,
      imageUrl: imageUrl,
      creditUsed: 5,
      remainingCredits: remainingCredits
    });

    return respData({
      success: true,
      results: resultImages,
      creditUsed: totalCost,
      remainingCredits: remainingCredits,
    });

  } catch (err) {
    console.log("AI workstation generate failed:", err);
    return respErr("图像生成失败，请稍后重试");
  }
}