#!/usr/bin/env node

/**
 * 测试AI工作站图片生成和显示功能的脚本
 * 使用方法: node scripts/test-ai-workstation.js
 */

import fetch from 'node-fetch';
import dotenv from "dotenv";

// 加载环境变量
dotenv.config({ path: '.env.development' });

async function testAIWorkstation() {
  console.log("🧪 测试AI工作站图片生成和显示功能...");
  
  // 检查必要的环境变量
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error("❌ 错误: 未设置 REPLICATE_API_TOKEN 环境变量");
    process.exit(1);
  }

  // 模拟前端请求数据
  const testData = {
    prompt: "Make this image more vibrant and colorful, enhance the details",
    images: [
      {
        id: "test_image_1",
        src: "https://s.magicaitool.com/flux-ai/flux-kontext/before-4.jpg",
        isUrl: true
      }
    ],
    model: "Pro",
    aspectRatio: "1:1",
    imageCount: 1,
    watermark: true
  };

  try {
    console.log("📤 发送图片生成请求...");
    console.log("   请求数据:", JSON.stringify(testData, null, 2));
    
    // 调用AI工作站API
    const response = await fetch('http://localhost:3000/api/ai-workstation/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 注意：这里需要有效的用户认证，实际使用时需要登录
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("✅ API响应成功:");
    console.log("   响应状态:", result.success);
    console.log("   消息:", result.message);
    
    if (result.success && result.results) {
      console.log("🎉 图片生成成功！");
      console.log("   生成数量:", result.results.length);
      console.log("   消耗积分:", result.creditUsed);
      console.log("   剩余积分:", result.remainingCredits);
      
      // 显示生成的图片信息
      result.results.forEach((image, index) => {
        console.log(`\n📸 图片 ${index + 1}:`);
        console.log("   ID:", image.id);
        console.log("   URL:", image.url);
        console.log("   提示词:", image.originalPrompt);
        console.log("   模型:", image.model);
        console.log("   宽高比:", image.aspectRatio);
        console.log("   生成时间:", image.generatedAt);
        console.log("   文件名:", image.filename);
      });
      
      // 测试图片URL可访问性
      if (result.results.length > 0) {
        const firstImage = result.results[0];
        console.log(`\n🔍 测试图片URL可访问性: ${firstImage.url}`);
        
        try {
          const imageResponse = await fetch(firstImage.url);
          if (imageResponse.ok) {
            console.log("✅ 图片URL可正常访问");
            console.log("   内容类型:", imageResponse.headers.get('content-type'));
            console.log("   文件大小:", imageResponse.headers.get('content-length'), "bytes");
          } else {
            console.log("⚠️ 图片URL访问异常:", imageResponse.status);
          }
        } catch (error) {
          console.log("❌ 图片URL访问失败:", error.message);
        }
      }
      
      console.log("\n🎯 前端显示建议:");
      console.log("   1. 将生成的图片URL设置到 currentGeneratedImage 状态");
      console.log("   2. 在CompareSlider中显示 beforeImage 和 afterImage 的对比");
      console.log("   3. 在ResultGrid中显示所有生成结果");
      console.log("   4. 更新用户积分显示");
      
    } else {
      console.log("❌ 图片生成失败");
      console.log("   错误信息:", result.message);
    }

  } catch (error) {
    console.error("❌ 测试失败:", error.message);
    
    if (error.message.includes("401")) {
      console.log("💡 提示: 需要用户登录认证");
    } else if (error.message.includes("422")) {
      console.log("💡 提示: 请求参数格式不正确");
    } else if (error.message.includes("500")) {
      console.log("💡 提示: 服务器内部错误");
    }
    
    process.exit(1);
  }
}

// 运行测试
testAIWorkstation();
