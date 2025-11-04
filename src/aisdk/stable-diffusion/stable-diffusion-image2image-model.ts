import type { 
  Image2ImageModelV1, 
  Image2ImageModelV1CallWarning 
} from "../provider/image2image-model/v1";
import { StableDiffusionModelId, StableDiffusionImage2ImageSettings } from "./stable-diffusion-settings";

import { FetchFunction } from "@ai-sdk/provider-utils";
import type { Resolvable } from "@ai-sdk/provider-utils";
import { newClient } from "./stable-diffusion-client";

interface StableDiffusionImage2ImageModelConfig {
  apiKey: string;
  provider: string;
  baseURL: string;
  headers: Resolvable<Record<string, string | undefined>>;
  fetch?: FetchFunction;
}

export class StableDiffusionImage2ImageModel implements Image2ImageModelV1 {
  readonly specificationVersion = "v1";

  readonly modelId: StableDiffusionModelId;
  readonly settings: StableDiffusionImage2ImageSettings;

  private readonly config: StableDiffusionImage2ImageModelConfig;

  get provider(): string {
    return this.config.provider;
  }

  get maxImagesPerCall(): number {
    return this.settings.maxImagesPerCall ?? 1;
  }

  constructor(
    modelId: StableDiffusionModelId,
    settings: StableDiffusionImage2ImageSettings,
    config: StableDiffusionImage2ImageModelConfig
  ) {
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }

  async doGenerate({
    prompt,
    image,
    negativePrompt,
    n = 1,
    strength = 0.8,
    steps = 20,
    guidanceScale = 7.5,
    seed,
    size,
    providerOptions,
    // headers,
    // abortSignal,
  }: Parameters<Image2ImageModelV1["doGenerate"]>[0]): Promise<
    Awaited<ReturnType<Image2ImageModelV1["doGenerate"]>>
  > {
    const warnings: Array<Image2ImageModelV1CallWarning> = [];
    let images: Array<Uint8Array> = [];

    if (!this.config.apiKey) {
      warnings.push({
        type: "other",
        message: "Stable Diffusion API key is not set",
      });
      return { images, warnings };
    }

    try {
      const client = await newClient({
        apiKey: this.config.apiKey,
        baseURL: this.config.baseURL,
        fetch: this.config.fetch,
      });

      // Convert image to base64 if it's Uint8Array
      let imageBase64: string;
      if (image instanceof Uint8Array) {
        imageBase64 = Buffer.from(image).toString('base64');
      } else {
        imageBase64 = image.startsWith('data:') ? image : `data:image/png;base64,${image}`;
      }

      const result = await client.generateImage2Image({
        model: this.modelId,
        prompt,
        image: imageBase64,
        negative_prompt: negativePrompt,
        num_images: n,
        strength: strength ?? this.settings.defaultStrength ?? 0.8,
        num_inference_steps: steps ?? this.settings.defaultSteps ?? 20,
        guidance_scale: guidanceScale ?? this.settings.defaultGuidanceScale ?? 7.5,
        seed,
        width: size?.width ?? this.settings.defaultSize?.width ?? 512,
        height: size?.height ?? this.settings.defaultSize?.height ?? 512,
        ...(providerOptions?.['stable-diffusion'] ?? {}),
      });

      if (!result.success) {
        warnings.push({
          type: "other",
          message: result.error || "Image generation failed",
        });
        return { images, warnings };
      }

      // Convert base64 images to Uint8Array
      if (result.images && result.images.length > 0) {
        images = result.images.map((base64Image: string) => {
          // Remove data URL prefix if present
          const base64Data = base64Image.replace(/^data:image\/[^;]+;base64,/, '');
          return new Uint8Array(Buffer.from(base64Data, 'base64'));
        });
      } else {
        warnings.push({
          type: "other",
          message: "No images generated",
        });
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Stable Diffusion image generation failed:", error);
      warnings.push({
        type: "other",
        message: errorMessage,
      });
    }

    return { images, warnings };
  }
}