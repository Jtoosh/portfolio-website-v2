/** GitHub commit search covers default branches. Keep author/public qualifiers;
 * ownership qualifiers would drop James's contributions to other repositories. */
export const activitySearchUrl =
  "https://api.github.com/search/commits?q=author%3AJtoosh%20is%3Apublic&sort=author-date&order=desc&per_page=100";
export const activityHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2026-03-10",
};

// Explicit identities and trailers can be extended as identified automation appears.
// Generic chore/docs/merge messages, AI assistance, and the word "automated"
// remain eligible: these do not distinguish automation from manual work.
export const knownAutomationIdentities = [
  "github-actions[bot]",
  "dependabot[bot]",
  "renovate[bot]",
  "release-please[bot]",
];
function automationIdentity(value) {
  return (
    typeof value === "string" &&
    (/\[bot\]$/i.test(value) ||
      knownAutomationIdentities.includes(value.toLowerCase()))
  );
}
function automated(item) {
  const identities = [item?.author, item?.committer];
  if (
    identities.some(
      (identity) =>
        identity?.type === "Bot" || automationIdentity(identity?.login),
    )
  )
    return true;
  if (
    [item?.commit?.author?.name, item?.commit?.committer?.name].some(
      automationIdentity,
    )
  )
    return true;
  return (
    item?.commit?.message?.split(/\r?\n/).some((line) => {
      const trailer = /^Generated-by:\s*(.+?)\s*$/i.exec(line);
      return trailer && automationIdentity(trailer[1]);
    }) ?? false
  );
}

function displayCommit(item) {
  const repository = item?.repository?.full_name;
  const sha = item?.sha;
  const message = item?.commit?.message;
  const authoredAt = item?.commit?.author?.date;
  if (
    (item?.author !== null &&
      (typeof item?.author?.login !== "string" || !item.author.login.trim())) ||
    typeof item?.repository?.private !== "boolean" ||
    typeof repository !== "string" ||
    !/^[\w.-]+\/[\w.-]+$/.test(repository) ||
    typeof sha !== "string" ||
    !/^[a-f0-9]{40}$/i.test(sha) ||
    typeof message !== "string" ||
    !message.split(/\r?\n/)[0].trim() ||
    typeof authoredAt !== "string" ||
    !Number.isFinite(Date.parse(authoredAt)) ||
    item.html_url !== `https://github.com/${repository}/commit/${sha}`
  )
    throw new Error("GitHub returned a malformed activity commit record.");
  if (
    item.author === null ||
    item.author.login.toLowerCase() !== "jtoosh" ||
    item.repository.private ||
    automated(item)
  )
    return null;
  return {
    sha,
    repository,
    message: message.split(/\r?\n/)[0].trim(),
    authoredAt,
    url: item.html_url,
  };
}

export function snapshotFromSearchResponses(responses, retrievedAt) {
  if (
    typeof retrievedAt !== "string" ||
    !Number.isFinite(Date.parse(retrievedAt))
  )
    throw new Error("Activity needs a valid successful retrieval timestamp.");
  const commits = [];
  for (const response of responses) {
    if (
      !response ||
      !Array.isArray(response.items) ||
      response.incomplete_results !== false ||
      !Number.isInteger(response.total_count) ||
      response.total_count < 0
    ) {
      throw new Error(
        "GitHub returned invalid or incomplete activity search results.",
      );
    }
    for (const item of response.items) {
      const commit = displayCommit(item);
      if (commit) commits.push(commit);
    }
  }
  commits.sort(
    (a, b) =>
      Date.parse(b.authoredAt) - Date.parse(a.authoredAt) ||
      a.repository.localeCompare(b.repository) ||
      a.sha.localeCompare(b.sha),
  );
  const seen = new Set();
  return {
    retrievedAt,
    commits: commits
      .filter((commit) => {
        if (seen.has(commit.sha)) return false;
        seen.add(commit.sha);
        return true;
      })
      .slice(0, 3),
  };
}

/** Fetch full candidate pages before selecting, without credentials. Throws on
 * failed/incomplete responses; the caller retains its previous usable snapshot. */
export async function retrieveActivity({
  fetcher = fetch,
  now = () => new Date(),
  signal,
} = {}) {
  const responses = [];
  for (let page = 1; page <= 10; page++) {
    const response = await fetcher(`${activitySearchUrl}&page=${page}`, {
      headers: activityHeaders,
      signal,
    });
    if (!response.ok)
      throw new Error(`GitHub activity request failed (${response.status}).`);
    const data = await response.json();
    responses.push(data);
    const snapshot = snapshotFromSearchResponses(
      responses,
      now().toISOString(),
    );
    if (snapshot.commits.length === 3 || page * 100 >= data.total_count)
      return snapshot;
  }
  return snapshotFromSearchResponses(responses, now().toISOString());
}
