export type ReplicateModelId = string;

export interface ReplicateText2ImageSettings {
  /**
   * Maximum number of images per API call.
   */
  maxImagesPerCall?: number;

  /**
   * Output format for generated images.
   */
  outputFormat?: "jpg" | "png" | "webp";

  /**
   * Default aspect ratio for generated images.
   */
  aspectRatio?: string;

  /**
   * Number of inference steps.
   */
  steps?: number;

  /**
   * Guidance scale for prompt adherence.
   */
  guidanceScale?: number;

  /**
   * Random seed for reproducible results.
   */
  seed?: number;

  /**
   * Image dimensions.
   */
  size?: {
    width: number;
    height: number;
  };

  /**
   * Whether to include safety checker.
   */
  safetyChecker?: boolean;

  /**
   * Custom model version or identifier.
   */
  version?: string;
}