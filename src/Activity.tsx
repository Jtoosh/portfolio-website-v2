import { useEffect, useState } from "react";
import packagedSnapshot from "./activity-snapshot.json";
import {
  retrieveActivity,
  type ActivitySnapshot,
} from "./activity-adapter.mjs";

import { readActivityCache, writeActivityCache } from "./activity-cache";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});
const freshnessFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

export function Activity() {
  const [snapshot, setSnapshot] = useState<ActivitySnapshot>(packagedSnapshot);
  useEffect(() => {
    // Start from packaged HTML on both server and client, then select local data
    // without awaiting any network work or producing hydration mismatches.
    const available = readActivityCache(packagedSnapshot);
    setSnapshot(available);
    if (Date.now() - Date.parse(available.retrievedAt) <= 3_600_000) return;
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    retrieveActivity({ signal: controller.signal })
      .then((result) => {
        if (!active || controller.signal.aborted) return;
        setSnapshot(result);
        writeActivityCache(result);
      })
      .catch(() => {
        // Failed attempts never replace the last successful snapshot or timestamp.
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);
  return (
    <section className="activity" aria-labelledby="activity-heading">
      <h3 id="activity-heading">Recent activity</h3>
      {snapshot.commits.length === 0 && (
        <p>No eligible public commits were found at the last retrieval.</p>
      )}
      <ul className="activity-list">
        {snapshot.commits.map((commit) => (
          <li key={commit.sha}>
            <a href={commit.url}>{commit.message}</a>
            <div className="activity-context">
              <span>{commit.repository}</span>
              <time dateTime={commit.authoredAt}>
                {dateFormat.format(new Date(commit.authoredAt))}
              </time>
            </div>
          </li>
        ))}
      </ul>
      <p className="activity-freshness">
        Last retrieved{" "}
        <time dateTime={snapshot.retrievedAt}>
          {freshnessFormat.format(new Date(snapshot.retrievedAt))} UTC
        </time>
      </p>
    </section>
  );
}
