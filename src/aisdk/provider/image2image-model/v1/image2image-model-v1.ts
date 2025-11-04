import { Image2ImageModelV1CallOptions } from "./image2image-model-v1-call-options";
import { Image2ImageModelV1CallWarning } from "./image2image-model-v1-call-warning";

export type Image2ImageModelV1 = {
  readonly specificationVersion: "v1";

  readonly provider: string;

  readonly modelId: string;

  readonly maxImagesPerCall: number | undefined;

  doGenerate(options: Image2ImageModelV1CallOptions): PromiseLike<{
    images: Array<string> | Array<Uint8Array>;
    warnings: Array<Image2ImageModelV1CallWarning>;
  }>;
};