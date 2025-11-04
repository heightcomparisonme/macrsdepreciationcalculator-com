import { Text2ImageModelV1CallOptions } from "./text2image-model-v1-call-options";
import { Text2ImageModelV1CallWarning } from "./text2image-model-v1-call-warning";

export type Text2ImageModelV1 = {
  readonly specificationVersion: "v1";

  readonly provider: string;

  readonly modelId: string;

  readonly maxImagesPerCall: number | undefined;

  doGenerate(options: Text2ImageModelV1CallOptions): PromiseLike<{
    images: Array<string> | Array<Uint8Array>;
    warnings: Array<Text2ImageModelV1CallWarning>;
  }>;
};