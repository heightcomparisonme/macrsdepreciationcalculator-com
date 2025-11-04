import {
  convertBase64ToUint8Array,
  convertUint8ArrayToBase64,
} from "@ai-sdk/provider-utils";

export interface ImageGenerationWarning {
  type: string;
  message: string;
}

export interface GeneratedImage {
  readonly base64: string;
  readonly uint8Array: Uint8Array;
  readonly url?: string;
}

export interface GenerateText2ImageResult {
  readonly images: Array<GeneratedImage>;
  readonly warnings: Array<ImageGenerationWarning>;
  readonly image: GeneratedImage; // First image for convenience
}

export class DefaultGeneratedImage implements GeneratedImage {
  private base64Data: string | undefined;
  private uint8ArrayData: Uint8Array | undefined;
  private _url: string | undefined;

  constructor({ image, url }: { image: string | Uint8Array; url?: string }) {
    const isUint8Array = image instanceof Uint8Array;

    this.base64Data = isUint8Array ? undefined : image;
    this.uint8ArrayData = isUint8Array ? image : undefined;
    this._url = url;
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

  get url() {
    return this._url;
  }
}