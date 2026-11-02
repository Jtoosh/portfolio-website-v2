import { useId } from "react";

export function TagFilter<Tag extends string>({
  title,
  description,
  tags,
  selected,
  onToggle,
  onClear,
}: {
  title: string;
  description: string;
  tags: readonly Tag[];
  selected: readonly Tag[];
  onToggle: (tag: Tag) => void;
  onClear: () => void;
}) {
  const headingId = useId();

  return (
    <section className="tag-section" aria-labelledby={headingId}>
      <h2 id={headingId}>{title}</h2>
      <p>{description}</p>
      <div className="tag-badges">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            aria-pressed={selected.includes(tag)}
            onClick={() => onToggle(tag)}
          >
            {tag}
          </button>
        ))}
        <button
          type="button"
          className="clear-tags"
          disabled={!selected.length}
          onClick={onClear}
        >
          Clear {title.toLowerCase()}
        </button>
      </div>
    </section>
  );
}
