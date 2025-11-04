/**
 * Example usage of Replicate provider with aisdk
 */

import { replicate, generateText2Image } from "@/aisdk";

// Example 1: Using Replicate with Flux model (same as current API route)
export async function generateWithFluxKontextMax(prompt: string) {
  const model = replicate.textToImage("black-forest-labs/flux-kontext-max", {
    outputFormat: "jpg",
    maxImagesPerCall: 1,
  });

  const result = await generateText2Image({
    model,
    prompt,
    outputFormat: "jpg",
    n: 1,
  });

  return result;
}

// Example 2: Using different Replicate models
export async function generateWithStableDiffusion(prompt: string) {
  const model = replicate.textToImage("stability-ai/stable-diffusion-3.5-large", {
    steps: 28,
    guidanceScale: 7.5,
    outputFormat: "png",
  });

  const result = await generateText2Image({
    model,
    prompt,
    negativePrompt: "blurry, low quality",
    n: 1,
    steps: 28,
    guidanceScale: 7.5,
  });

  return result;
}

// Example 3: Batch generation
export async function generateMultipleImages(prompt: string, count: number = 4) {
  const model = replicate.textToImage("black-forest-labs/flux-dev", {
    outputFormat: "jpg",
    maxImagesPerCall: 1, // Replicate typically supports 1 image per call
  });

  const result = await generateText2Image({
    model,
    prompt,
    n: count, // This will make multiple API calls automatically
  });

  return result;
}

// Example 4: With custom settings
export async function generateWithCustomSettings(
  prompt: string,
  options: {
    aspectRatio?: string;
    seed?: number;
    steps?: number;
  } = {}
) {
  const model = replicate.textToImage("black-forest-labs/flux-pro", {
    outputFormat: "jpg",
    aspectRatio: options.aspectRatio,
    steps: options.steps,
    seed: options.seed,
  });

  const result = await generateText2Image({
    model,
    prompt,
    aspectRatio: options.aspectRatio,
    seed: options.seed,
    steps: options.steps,
    n: 1,
  });

  return result;
}