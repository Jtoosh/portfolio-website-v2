import snapshot from "./activity-snapshot.json";

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
