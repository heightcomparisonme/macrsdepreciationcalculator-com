/**
 * Replicate API 工具函数
 * 用于处理Replicate API的输出和图片URL
 */

export interface ReplicateOutput {
  url?: string | (() => string);
  [key: string]: any;
}

/**
 * 从Replicate API输出中提取图片URL
 * @param output Replicate API的输出
 * @returns 图片URL字符串
 */
export function extractImageUrl(output: ReplicateOutput | ReplicateOutput[] | any): string {
  // 如果output是数组，取第一个元素
  if (Array.isArray(output)) {
    if (output.length === 0) {
      return "";
    }
    return extractImageUrl(output[0]);
  }

  // 如果output是对象
  if (output && typeof output === 'object') {
    // 如果output.url是一个函数，调用它
    if (typeof output.url === 'function') {
      return output.url();
    }
    
    // 如果output.url直接是字符串
    if (typeof output.url === 'string') {
      return output.url;
    }
    
    // 检查其他可能的字段
    const possibleFields = ['image', 'result', 'output', 'file'];
    for (const field of possibleFields) {
      if (output[field]) {
        const fieldValue = output[field];
        if (typeof fieldValue === 'string') {
          return fieldValue;
        }
        if (typeof fieldValue === 'function') {
          return fieldValue();
        }
      }
    }
  }

  return "";
}

/**
 * 验证图片URL是否有效
 * @param url 图片URL
 * @returns 是否有效
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * 获取图片文件名
 * @param url 图片URL
 * @param defaultName 默认文件名
 * @returns 文件名
 */
export function getImageFilename(url: string, defaultName: string = "image.jpg"): string {
  if (!isValidImageUrl(url)) {
    return defaultName;
  }

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop();
    
    if (filename && filename.includes('.')) {
      return filename;
    }
    
    // 如果没有扩展名，添加.jpg
    return filename ? `${filename}.jpg` : defaultName;
  } catch {
    return defaultName;
  }
}

/**
 * 处理Replicate API错误
 * @param error 错误对象
 * @returns 用户友好的错误信息
 */
export function handleReplicateError(error: any): string {
  if (error.message) {
    if (error.message.includes("401")) {
      return "API认证失败，请检查API token";
    } else if (error.message.includes("422")) {
      return "输入参数格式不正确，请检查图像URL";
    } else if (error.message.includes("429")) {
      return "API调用频率过高，请稍后重试";
    } else if (error.message.includes("500")) {
      return "服务器内部错误，请稍后重试";
    }
  }
  
  return "AI模型调用失败，请稍后重试";
}

/**
 * 创建图片结果对象
 * @param imageUrl 图片URL
 * @param prompt 提示词
 * @param model 模型名称
 * @param aspectRatio 宽高比
 * @returns 图片结果对象
 */
export function createImageResult(
  imageUrl: string,
  prompt: string,
  model: string = "Pro",
  aspectRatio: string = "1:1"
) {
  return {
    id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    url: imageUrl,
    originalPrompt: prompt,
    model: model,
    aspectRatio: aspectRatio,
    generatedAt: new Date().toISOString(),
    seed: Math.floor(Math.random() * 1000000),
    steps: model === "Pro" ? 28 : 50,
    filename: getImageFilename(imageUrl, `ai_workstation_result_${Date.now()}.jpg`),
  };
}
