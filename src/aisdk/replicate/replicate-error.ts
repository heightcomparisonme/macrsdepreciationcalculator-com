/**
 * Handle Replicate API errors and convert to user-friendly messages
 */
export function handleReplicateError(error: unknown): string {
  if (error instanceof Error && error.message) {
    if (error.message.includes("401")) {
      return "API认证失败，请检查API token";
    } else if (error.message.includes("422")) {
      return "输入参数格式不正确";
    } else if (error.message.includes("429")) {
      return "API调用频率过高，请稍后重试";
    } else if (error.message.includes("500")) {
      return "服务器内部错误，请稍后重试";
    }
  }

  return "Replicate API调用失败，请稍后重试";
}

/**
 * Extract image URLs from Replicate API response
 */
export function extractImageUrls(output: unknown): string[] {
  // Handle array output
  if (Array.isArray(output)) {
    return output.filter(item => typeof item === 'string' && item.startsWith('http'));
  }

  // Handle object with url field
  if (output && typeof output === 'object') {
    if (typeof output.url === 'string') {
      return [output.url];
    }
    
    // Check for common fields that might contain URLs
    const possibleFields = ['image', 'result', 'output', 'file', 'images'];
    for (const field of possibleFields) {
      if (output[field]) {
        const fieldValue = output[field];
        if (typeof fieldValue === 'string' && fieldValue.startsWith('http')) {
          return [fieldValue];
        }
        if (Array.isArray(fieldValue)) {
          return fieldValue.filter(item => typeof item === 'string' && item.startsWith('http'));
        }
      }
    }
  }

  // Handle direct string output
  if (typeof output === 'string' && output.startsWith('http')) {
    return [output];
  }

  return [];
}