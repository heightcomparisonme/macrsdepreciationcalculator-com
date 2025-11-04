import Replicate from "replicate";
import type { FetchFunction } from "@ai-sdk/provider-utils";

export interface ReplicateClientConfig {
  apiToken: string;
  baseURL?: string;
  headers?: Record<string, string>;
  fetch?: FetchFunction;
}

export class ReplicateClient {
  private client: Replicate;

  constructor(config: ReplicateClientConfig) {
    this.client = new Replicate({
      auth: config.apiToken,
      ...(config.fetch && { fetch: config.fetch }),
      ...(config.baseURL && { baseURL: config.baseURL })
    });
  }

  async run(
    model: string,
    input: Record<string, unknown>,
    options?: {
      wait?: { interval?: number };
      webhook?: string;
      webhook_events_filter?: string[];
    }
  ): Promise<unknown> {
    return this.client.run(model as any, { input }, options);
  }

  async create(
    model: string,
    input: Record<string, unknown>,
    options?: {
      webhook?: string;
      webhook_events_filter?: string[];
    }
  ): Promise<unknown> {
    return this.client.predictions.create({
      version: model,
      input,
      ...options
    });
  }

  async get(id: string): Promise<unknown> {
    return this.client.predictions.get(id);
  }

  async cancel(id: string): Promise<unknown> {
    return this.client.predictions.cancel(id);
  }
}