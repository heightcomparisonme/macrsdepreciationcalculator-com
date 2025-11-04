import type { FetchFunction } from "@ai-sdk/provider-utils";

export interface StableDiffusionClientConfig {
  apiKey: string;
  baseURL?: string;
  fetch?: FetchFunction;
}

interface APIResponse {
  success: boolean;
  images?: string[];
  error?: string;
}

interface Image2ImageRequest {
  model: string;
  prompt: string;
  image: string; // base64 encoded image
  negative_prompt?: string;
  num_images?: number;
  strength?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number;
  width?: number;
  height?: number;
  scheduler?: string;
  [key: string]: unknown;
}

class StableDiffusionClient {
  private apiKey: string;
  private baseURL: string;
  private fetch: FetchFunction;

  constructor(config: Required<StableDiffusionClientConfig>) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL;
    this.fetch = config.fetch;
  }

  async generateImage2Image(request: Image2ImageRequest): Promise<APIResponse> {
    try {
      const url = `${this.baseURL}/v1/generation/image-to-image`;
      
      console.log("Stable Diffusion Image2Image request:", url, {
        ...request,
        image: `[base64 image ${request.image.length} chars]` // Don't log full image
      });

      const response = await this.fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json() as Record<string, unknown>;

      // Handle different API response formats
      if (data.artifacts && Array.isArray(data.artifacts)) {
        // Stability AI format
        return {
          success: true,
          images: data.artifacts.map((artifact: unknown) => {
            const art = artifact as { base64: string };
            return art.base64;
          }),
        };
      } else if (data.images && Array.isArray(data.images)) {
        // Generic format
        return {
          success: true,
          images: data.images as string[],
        };
      } else if (data.data && Array.isArray(data.data)) {
        // OpenAI-style format
        return {
          success: true,
          images: data.data.map((item: unknown) => {
            const imgItem = item as { b64_json?: string; url?: string };
            return imgItem.b64_json || imgItem.url || '';
          }),
        };
      } else {
        return {
          success: false,
          error: "Unknown response format",
        };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Stable Diffusion API call failed:", error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async textToImage(request: Omit<Image2ImageRequest, 'image' | 'strength'>): Promise<APIResponse> {
    try {
      const url = `${this.baseURL}/v1/generation/text-to-image`;
      
      const response = await this.fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json() as Record<string, unknown>;

      // Handle different API response formats (same as image2image)
      if (data.artifacts && Array.isArray(data.artifacts)) {
        return {
          success: true,
          images: data.artifacts.map((artifact: unknown) => {
            const art = artifact as { base64: string };
            return art.base64;
          }),
        };
      } else if (data.images && Array.isArray(data.images)) {
        return {
          success: true,
          images: data.images as string[],
        };
      } else if (data.data && Array.isArray(data.data)) {
        return {
          success: true,
          images: data.data.map((item: unknown) => {
            const imgItem = item as { b64_json?: string; url?: string };
            return imgItem.b64_json || imgItem.url || '';
          }),
        };
      } else {
        return {
          success: false,
          error: "Unknown response format",
        };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Stable Diffusion text-to-image API call failed:", error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export async function newClient(config: StableDiffusionClientConfig): Promise<StableDiffusionClient> {
  const finalConfig = {
    apiKey: config.apiKey,
    baseURL: config.baseURL || "https://api.stability.ai", // Default to Stability AI
    fetch: config.fetch || (globalThis.fetch?.bind(globalThis) ?? fetch),
  };

  return new StableDiffusionClient(finalConfig);
}