import type { ProviderHealth, ProviderStatus } from "./types";

export class ProviderHealthService {
  private readonly snapshots = new Map<string, ProviderHealth>();

  register(provider: {
    name: string;
    displayName: string;
    enabled: boolean;
  }): void {
    if (!this.snapshots.has(provider.name)) {
      this.snapshots.set(provider.name, {
        provider: provider.name,
        displayName: provider.displayName,
        enabled: provider.enabled,
        status: provider.enabled ? "OFFLINE" : "DISABLED",
        lastSuccessfulRequest: null,
        lastFailedRequest: null,
        lastError: null,
        responseTimeMs: null,
        rateLimited: false,
        failureCount: 0,
      });
    }
  }

  recordSuccess(provider: string, responseTimeMs: number): void {
    const snapshot = this.snapshots.get(provider);
    if (!snapshot) return;

    snapshot.status = "ONLINE";
    snapshot.lastSuccessfulRequest = new Date();
    snapshot.lastError = null;
    snapshot.responseTimeMs = responseTimeMs;
    snapshot.rateLimited = false;
  }

  recordFailure(
    provider: string,
    error: { message: string; rateLimited?: boolean },
  ): void {
    const snapshot = this.snapshots.get(provider);
    if (!snapshot) return;

    snapshot.lastFailedRequest = new Date();
    snapshot.lastError = error.message;
    snapshot.failureCount += 1;
    snapshot.rateLimited = error.rateLimited ?? false;
    snapshot.status = error.rateLimited ? "RATE_LIMITED" : "DEGRADED";
  }

  list(): ProviderHealth[] {
    return Array.from(this.snapshots.values()).map((snapshot) => ({
      ...snapshot,
      status: snapshot.status as ProviderStatus,
    }));
  }
}

export const providerHealth = new ProviderHealthService();
