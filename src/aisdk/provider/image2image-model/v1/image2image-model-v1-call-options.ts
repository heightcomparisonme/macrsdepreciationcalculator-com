import { JSONValue } from "@ai-sdk/provider";

export interface Image2ImageModelV1CallOptions {
  /**
   * Text prompt for the image generation.
   */
  prompt: string;

  /**
   * Input image for image-to-image generation.
   * Can be a base64 string, URL, or Uint8Array.
   */
  image: string | Uint8Array;

  /**
   * Negative prompt to avoid certain elements.
   */
  negativePrompt?: string;

  /**
   * Number of images to generate. Default is 1.
   */
  n?: number;

  /**
   * Strength of the transformation (0.0 to 1.0).
   * Higher values give more creative freedom, lower values stay closer to the input image.
   * Default is 0.8.
   */
  strength?: number;

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