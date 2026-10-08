import type { ActivitySnapshot } from "./activity-adapter.mjs";

const cacheKey = "portfolio-activity-v1";

function validSnapshot(value: unknown): value is ActivitySnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<ActivitySnapshot>;
  if (
    typeof snapshot.retrievedAt !== "string" ||
    !Number.isFinite(Date.parse(snapshot.retrievedAt)) ||
    Date.parse(snapshot.retrievedAt) > Date.now() ||
    !Array.isArray(snapshot.commits) ||
    snapshot.commits.length > 3
  )
    return false;
  const seen = new Set<string>();
  return snapshot.commits.every((commit) => {
    if (
      !commit ||
      typeof commit !== "object" ||
      typeof commit.sha !== "string" ||
      !/^[a-f0-9]{40}$/i.test(commit.sha) ||
      seen.has(commit.sha) ||
      typeof commit.repository !== "string" ||
      !/^[\w.-]+\/[\w.-]+$/.test(commit.repository) ||
      typeof commit.message !== "string" ||
      !commit.message.trim() ||
      /[\r\n]/.test(commit.message) ||
      typeof commit.authoredAt !== "string" ||
      !Number.isFinite(Date.parse(commit.authoredAt)) ||
      commit.url !==
        `https://github.com/${commit.repository}/commit/${commit.sha}`
    )
      return false;
    seen.add(commit.sha);
    return true;
  });
}

export function readActivityCache(
  fallback: ActivitySnapshot,
): ActivitySnapshot {
  try {
    const cached: unknown = JSON.parse(
      localStorage.getItem(cacheKey) ?? "null",
    );
    if (
      validSnapshot(cached) &&
      Date.parse(cached.retrievedAt) > Date.parse(fallback.retrievedAt)
    )
      return cached;
  } catch {
    // Storage is optional; the genuine packaged snapshot remains usable.
  }
  return fallback;
}

export function writeActivityCache(snapshot: ActivitySnapshot): void {
  try {
    localStorage.setItem(cacheKey, JSON.stringify(snapshot));
  } catch {
    // An in-memory successful refresh still displays when persistence is blocked.
  }
}
