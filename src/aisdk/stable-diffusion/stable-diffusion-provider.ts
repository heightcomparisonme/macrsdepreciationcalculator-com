import { StableDiffusionModelId, StableDiffusionImage2ImageSettings } from "./stable-diffusion-settings";

import type { FetchFunction } from "@ai-sdk/provider-utils";
import { StableDiffusionImage2ImageModel } from "./stable-diffusion-image2image-model";
import { loadSetting } from "@ai-sdk/provider-utils";

export interface StableDiffusionProviderSettings {
  apiKey?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  fetch?: FetchFunction;
}

export interface StableDiffusionProvider {
  /**
   * Create an image-to-image model for Stable Diffusion.
   */
  image2image(
    modelId: StableDiffusionModelId,
    settings?: StableDiffusionImage2ImageSettings
  ): StableDiffusionImage2ImageModel;

  /**
   * Create a text-to-image model (for future extension).
   */
  textToImage?: (
    modelId: StableDiffusionModelId,
    settings?: Record<string, unknown>
  ) => Record<string, unknown>; // Placeholder for future text-to-image implementation
}

export function createStableDiffusion(
  options: StableDiffusionProviderSettings = {}
): StableDiffusionProvider {
  const loadApiKey = () =>
    loadSetting({
      settingValue: options.apiKey,
      settingName: "apiKey",
      environmentVariableName: "STABLE_DIFFUSION_API_KEY",
      description: "Stable Diffusion API key",
    });

  return {
    image2image: (
      modelId: StableDiffusionModelId, 
      settings?: StableDiffusionImage2ImageSettings
    ) => {
      return new StableDiffusionImage2ImageModel(modelId, settings ?? {}, {
        apiKey: loadApiKey(),
        provider: "stable-diffusion",
        baseURL: options.baseURL ?? "https://api.stability.ai",
        headers: {
          ...options.headers,
        },
        fetch: options.fetch,
      });
    },
  };
}

// Default instance for easy usage
export const stableDiffusion = createStableDiffusion();