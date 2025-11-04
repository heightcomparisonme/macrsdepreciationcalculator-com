import { GenerateImage2ImageResult } from "./generate-image2image-result";
import {
  DefaultGenerateImage2ImageResult,
  DefaultGeneratedImage2Image,
} from "./generate-image2image-result";

import { JSONValue } from "@ai-sdk/provider";
import { Image2ImageModelV1CallWarning } from "../provider/image2image-model/v1";
import { Image2ImageModelV1 } from "../provider/image2image-model/v1";

export async function generateImage2Image({
  model,
  prompt,
  image,
  negativePrompt,
  n = 1,
  strength,
  steps,
  guidanceScale,
  seed,
  size,
  providerOptions,
  // maxRetries,
  abortSignal,
  headers,
}: {
  model: Image2ImageModelV1;
  prompt: string;
  image: string | Uint8Array;
  negativePrompt?: string;
  n?: number;
  strength?: number;
  steps?: number;
  guidanceScale?: number;
  seed?: number;
  size?: {
    width: number;
    height: number;
  };
  providerOptions?: Record<string, Record<string, JSONValue>>;
  maxRetries?: number;
  abortSignal?: AbortSignal;
  headers?: Record<string, string>;
}): Promise<GenerateImage2ImageResult> {
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
        image,
        negativePrompt,
        n: callImageCount,
        strength,
        steps,
        guidanceScale,
        seed,
        size,
        abortSignal,
        headers,
        providerOptions: providerOptions ?? {},
      })
    )
  );

  const images: Array<DefaultGeneratedImage2Image> = [];
  const warnings: Array<Image2ImageModelV1CallWarning> = [];

  for (const result of results) {
    images.push(
      ...result.images.map((image) => new DefaultGeneratedImage2Image({ image }))
    );
    warnings.push(...result.warnings);
  }

  return new DefaultGenerateImage2ImageResult({ images, warnings });
}