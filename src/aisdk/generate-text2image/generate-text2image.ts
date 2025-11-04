import { GenerateText2ImageResult, GeneratedImage, DefaultGeneratedImage, ImageGenerationWarning } from "./generate-text2image-result";

import { JSONValue } from "@ai-sdk/provider";
import { Text2ImageModelV1 } from "@/aisdk/provider";

export async function generateText2Image({
  model,
  prompt,
  negativePrompt,
  n = 1,
  seed,
  steps,
  guidanceScale,
  size,
  aspectRatio,
  outputFormat,
  providerOptions,
  // maxRetries,
  abortSignal,
  headers,
}: {
  model: Text2ImageModelV1;
  prompt: string;
  negativePrompt?: string;
  n?: number;
  seed?: number;
  steps?: number;
  guidanceScale?: number;
  size?: {
    width: number;
    height: number;
  };
  aspectRatio?: string;
  outputFormat?: "jpg" | "png" | "webp";
  providerOptions?: Record<string, Record<string, JSONValue>>;
  maxRetries?: number;
  abortSignal?: AbortSignal;
  headers?: Record<string, string>;
}): Promise<GenerateText2ImageResult> {
  const maxImagesPerCall = model.maxImagesPerCall ?? 1;

  const callCount = Math.ceil(n / maxImagesPerCall);
  const callImageCounts = Array.from({ length: callCount }, (_, i) => {
    if (i < callCount - 1) {
      return maxImagesPerCall;
    }

    const remainder = n % maxImagesPerCall;
    return remainder === 0 ? maxImagesPerCall : remainder;
  });

  const results = await Promise.all(
    callImageCounts.map(async (callImageCount) =>
      model.doGenerate({
        prompt,
        negativePrompt,
        n: callImageCount,
        seed,
        steps,
        guidanceScale,
        size,
        aspectRatio,
        outputFormat,
        abortSignal,
        headers,
        providerOptions: providerOptions ?? {},
      })
    )
  );

  const images: Array<DefaultGeneratedImage> = [];
  const warnings: Array<ImageGenerationWarning> = [];

  for (const result of results) {
    images.push(
      ...result.images.map((image) => {
        // If image is a URL string, keep it as URL
        if (typeof image === 'string' && image.startsWith('http')) {
          return new DefaultGeneratedImage({ image, url: image });
        }
        // Otherwise treat as base64 or Uint8Array
        return new DefaultGeneratedImage({ image });
      })
    );
    warnings.push(...result.warnings);
  }

  return new DefaultGenerateText2ImageResult({ images, warnings });
}

class DefaultGenerateText2ImageResult implements GenerateText2ImageResult {
  readonly images: Array<GeneratedImage>;
  readonly warnings: Array<ImageGenerationWarning>;

  constructor(options: {
    images: Array<DefaultGeneratedImage>;
    warnings: Array<ImageGenerationWarning>;
  }) {
    this.images = options.images;
    this.warnings = options.warnings;
  }

  get image() {
    return this.images[0];
  }
}