#!/usr/bin/env node

/**
 * 测试图片生成和返回功能的脚本
 * 使用方法: node scripts/test-image-generation.js
 */

import Replicate from "replicate";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config({ path: '.env.development' });

async function testImageGeneration() {
  console.log("🧪 测试图片生成和返回功能...");
  
  // 检查API token
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error("❌ 错误: 未设置 REPLICATE_API_TOKEN 环境变量");
    process.exit(1);
  }

  try {
    // 初始化Replicate客户端
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    console.log("✅ Replicate客户端初始化成功");

    // 测试1: 只有提示词的生成
    console.log("\n📝 测试1: 纯文本提示词生成");
    const input1 = {
      prompt: "A beautiful sunset over mountains, digital art style",
      output_format: "jpg"
    };
    
    console.log("   输入参数:", input1);
    console.log("   调用API...");
    
    const output1 = await replicate.run("black-forest-labs/flux-kontext-max", { input: input1 });
    console.log("   API输出:", output1);
    
    // 获取图片URL
    let imageUrl1 = "";
    if (output1 && typeof output1.url === 'function') {
      imageUrl1 = output1.url();
      console.log("   ✅ 获取到图片URL (函数):", imageUrl1);
    } else if (output1 && output1.url) {
      imageUrl1 = output1.url;
      console.log("   ✅ 获取到图片URL (直接):", imageUrl1);
    } else if (output1 && Array.isArray(output1)) {
      const firstOutput = output1[0];
      if (typeof firstOutput.url === 'function') {
        imageUrl1 = firstOutput.url();
      } else if (firstOutput.url) {
        imageUrl1 = firstOutput.url;
      }
      console.log("   ✅ 从数组获取到图片URL:", imageUrl1);
    } else {
      console.log("   ❌ 无法获取图片URL");
    }

    // 测试2: 提示词 + 图像输入
    if (imageUrl1) {
      console.log("\n🖼️ 测试2: 提示词 + 图像输入");
      const input2 = {
        prompt: "Make the image more vibrant and colorful",
        input_image: imageUrl1,
        output_format: "jpg"
      };
      
      console.log("   输入参数:", input2);
      console.log("   调用API...");
      
      const output2 = await replicate.run("black-forest-labs/flux-kontext-max", { input: input2 });
      console.log("   API输出:", output2);
      
      // 获取第二张图片URL
      let imageUrl2 = "";
      if (output2 && typeof output2.url === 'function') {
        imageUrl2 = output2.url();
        console.log("   ✅ 获取到第二张图片URL:", imageUrl2);
      } else if (output2 && output2.url) {
        imageUrl2 = output2.url;
        console.log("   ✅ 获取到第二张图片URL:", output2.url);
      } else if (output2 && Array.isArray(output2)) {
        const firstOutput = output2[0];
        if (typeof firstOutput.url === 'function') {
          imageUrl2 = firstOutput.url();
        } else if (firstOutput.url) {
          imageUrl2 = firstOutput.url;
        }
        console.log("   ✅ 从数组获取到第二张图片URL:", imageUrl2);
      }
    }

    console.log("\n🎉 图片生成测试完成！");
    console.log("\n💡 测试结果:");
    console.log("   - 纯文本生成:", imageUrl1 ? "✅ 成功" : "❌ 失败");
    console.log("   - 图像编辑:", imageUrl1 ? "✅ 成功" : "❌ 跳过");
    
    if (imageUrl1) {
      console.log("\n🔗 生成的图片链接:");
      console.log("   第一张:", imageUrl1);
      console.log("\n📱 在浏览器中打开这些链接查看生成的图片");
    }

  } catch (error) {
    console.error("❌ 测试失败:", error.message);
    
    if (error.message.includes("401")) {
      console.log("💡 提示: API token可能无效");
    } else if (error.message.includes("422")) {
      console.log("💡 提示: 输入参数格式不正确");
    } else if (error.message.includes("429")) {
      console.log("💡 提示: API调用频率过高，请稍后重试");
    }
    
    process.exit(1);
  }
}

// 运行测试
testImageGeneration();
