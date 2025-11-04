import { ReplicateModelId, ReplicateText2ImageSettings } from "./replicate-settings";
import { ReplicateText2ImageModel } from "./replicate-text2image-model";
import type { FetchFunction } from "@ai-sdk/provider-utils";
import { loadSetting } from "@ai-sdk/provider-utils";

export interface ReplicateProviderSettings {
  apiToken?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  fetch?: FetchFunction;
}

export interface ReplicateProvider {
  /**
   * Create a text-to-image model for Replicate.
   */
  textToImage(
    modelId: ReplicateModelId,
    settings?: ReplicateText2ImageSettings
  ): ReplicateText2ImageModel;

  /**
   * Alias for textToImage for convenience.
   */
  text2image(
    modelId: ReplicateModelId,
    settings?: ReplicateText2ImageSettings
  ): ReplicateText2ImageModel;
}

export function createReplicate(
  options: ReplicateProviderSettings = {}
): ReplicateProvider {
  const loadApiToken = () =>
    loadSetting({
      settingValue: options.apiToken,
      settingName: "apiToken",
      environmentVariableName: "REPLICATE_API_TOKEN",
      description: "Replicate API token",
    });

  const createTextToImageModel = (
    modelId: ReplicateModelId,
    settings?: ReplicateText2ImageSettings
  ) => {
    return new ReplicateText2ImageModel(modelId, settings ?? {}, {
      apiToken: loadApiToken(),
      provider: "replicate",
      baseURL: options.baseURL ?? "https://api.replicate.com",
      headers: {
        ...options.headers,
      },
      fetch: options.fetch,
    });
  };

  return {
    textToImage: createTextToImageModel,
    text2image: createTextToImageModel,
  };
}

// Default instance for easy usage
export const replicate = createReplicate();