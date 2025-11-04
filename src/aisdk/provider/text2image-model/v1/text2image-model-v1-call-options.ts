import { JSONValue } from "@ai-sdk/provider";

export interface Text2ImageModelV1CallOptions {
  /**
   * Text prompt for the image generation.
   */
  prompt: string;

  /**
   * Negative prompt to avoid certain elements.
   */
  negativePrompt?: string;

  /**
   * Number of images to generate. Default is 1.
   */
  n?: number;

  /**
   * Random seed for reproducible results.
   */
  seed?: number;

  /**
   * Number of inference steps. More steps generally produce higher quality but take longer.
   * Typical range: 20-50.
   */
  steps?: number;

  /**
   * Guidance scale for prompt adherence.
   * Higher values follow the prompt more closely.
   * Typical range: 7.5-15.
   */
  guidanceScale?: number;

  /**
   * Output image size.
   */
  size?: {
    width: number;
    height: number;
  };

  /**
   * Aspect ratio for the output image.
   */
  aspectRatio?: string;

  /**
   * Output format for the image.
   */
  outputFormat?: "jpg" | "png" | "webp";

  /**
   * Additional provider-specific options.
   */
  providerOptions?: Record<string, Record<string, JSONValue>>;

  /**
   * Custom headers to include in the request.
   */
  headers?: Record<string, string>;

  /**
   * Abort signal for cancelling the request.
   */
  abortSignal?: AbortSignal;
}