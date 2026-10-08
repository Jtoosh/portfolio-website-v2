export interface ActivityCommit {
  sha: string;
  repository: string;
  message: string;
  authoredAt: string;
  url: string;
}
export interface ActivitySnapshot {
  retrievedAt: string;
  commits: ActivityCommit[];
}
export const activitySearchUrl: string;
export const activityHeaders: Record<string, string>;
export const knownAutomationIdentities: string[];
export function snapshotFromSearchResponses(
  responses: unknown[],
  retrievedAt: string,
): ActivitySnapshot;
export function retrieveActivity(options?: {
  fetcher?: typeof fetch;
  now?: () => Date;
  signal?: AbortSignal;
}): Promise<ActivitySnapshot>;
