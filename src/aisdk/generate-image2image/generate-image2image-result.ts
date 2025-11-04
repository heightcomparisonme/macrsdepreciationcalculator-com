import {
  convertBase64ToUint8Array,
  convertUint8ArrayToBase64,
} from "@ai-sdk/provider-utils";

import { Image2ImageModelV1CallWarning } from "../provider/image2image-model/v1";

export interface GeneratedImage2Image {
  readonly base64: string;
  readonly uint8Array: Uint8Array;
}

export interface GenerateImage2ImageResult {
  readonly images: Array<GeneratedImage2Image>;
  readonly warnings: Array<Image2ImageModelV1CallWarning>;

  /**
   * Returns the first generated image.
   */
  readonly image: GeneratedImage2Image;
}

export class DefaultGenerateImage2ImageResult implements GenerateImage2ImageResult {
  readonly images: Array<GeneratedImage2Image>;
  readonly warnings: Array<Image2ImageModelV1CallWarning>;

  constructor(options: {
    images: Array<DefaultGeneratedImage2Image>;
    warnings: Array<Image2ImageModelV1CallWarning>;
  }) {
    this.images = options.images;
    this.warnings = options.warnings;
  }

  get image() {
    return this.images[0];
  }
}

export class DefaultGeneratedImage2Image implements GeneratedImage2Image {
  private base64Data: string | undefined;
  private uint8ArrayData: Uint8Array | undefined;

  constructor({ image }: { image: string | Uint8Array }) {
    const isUint8Array = image instanceof Uint8Array;

    this.base64Data = isUint8Array ? undefined : image;
    this.uint8ArrayData = isUint8Array ? image : undefined;
  }

  get base64() {
    if (this.base64Data == null) {
      this.base64Data = convertUint8ArrayToBase64(this.uint8ArrayData!);
    }
    return this.base64Data;
  }

  get uint8Array() {
    if (this.uint8ArrayData == null) {
      this.uint8ArrayData = convertBase64ToUint8Array(this.base64Data!);
    }
    return this.uint8ArrayData;
  }
}