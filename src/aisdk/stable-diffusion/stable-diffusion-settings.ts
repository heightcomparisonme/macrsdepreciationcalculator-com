// Stable Diffusion Model IDs
export type StableDiffusionModelId = 
  | "stable-diffusion-v1-5"
  | "stable-diffusion-xl-base-1.0"
  | "stable-diffusion-xl-refiner-1.0"
  | "stable-diffusion-2-1"
  | string; // Allow custom model IDs

// Image-to-Image specific settings
export interface StableDiffusionImage2ImageSettings {
  /**
   * Maximum number of images to generate per API call.
   * Default: 1
   */
  maxImagesPerCall?: number;

  /**
   * Default strength for image-to-image transformations.
   * Range: 0.0 to 1.0
   * Default: 0.8
   */
  defaultStrength?: number;

  /**
   * Default number of inference steps.
   * Default: 20
   */
  defaultSteps?: number;

  /**
   * Default guidance scale.
   * Default: 7.5
   */
  defaultGuidanceScale?: number;

  /**
   * Default image size.
   */
  defaultSize?: {
    width: number;
    height: number;
  };

  /**
   * Available schedulers/samplers.
   */
  schedulers?: string[];
}