import { useEffect, useId, useRef, useState, type RefObject } from "react";

export type TagFilterProps<Tag extends string> = {
  title: string;
  tags: readonly Tag[];
  selected: readonly Tag[];
  onToggle: (tag: Tag) => void;
  onClear: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
};

function positionPanel(trigger: HTMLButtonElement, panel: HTMLDivElement) {
  const margin = 16;
  const gap = 8;
  const rect = trigger.getBoundingClientRect();
  const width = Math.min(Math.max(260, rect.width), innerWidth - margin * 2);
  const below = innerHeight - rect.bottom - gap - margin;
  const above = rect.top - gap - margin;
  const side = below >= 320 || below >= above ? "below" : "above";
  Object.assign(panel.style, {
    margin: "0",
    width: `${width}px`,
    left: `${Math.max(margin, Math.min(rect.left, innerWidth - width - margin))}px`,
    right: "auto",
    top: side === "below" ? `${Math.max(margin, rect.bottom + gap)}px` : "auto",
    bottom:
      side === "above"
        ? `${Math.max(margin, innerHeight - rect.top + gap)}px`
        : "auto",
    maxHeight: `${Math.max(1, side === "below" ? below : above)}px`,
  });
  panel.dataset.side = side;
}

export function TagFilter<Tag extends string>({
  title,
  tags,
  selected,
  onToggle,
  onClear,
  triggerRef,
}: TagFilterProps<Tag>) {
  const panelId = useId();
  const ownTrigger = useRef<HTMLButtonElement>(null);
  const trigger = triggerRef ?? ownTrigger;
  const panel = useRef<HTMLDivElement>(null);
  // Omit explicit ARIA state in prerendered HTML so the native invoker's
  // expanded state remains accurate before React hydrates (or without JS).
  const [open, setOpen] = useState<boolean | undefined>(undefined);
  const position = () => {
    if (trigger.current && panel.current)
      positionPanel(trigger.current, panel.current);
  };

  useEffect(() => {
    setOpen(panel.current?.matches(":popover-open") ?? false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const button = trigger.current;
      const content = panel.current;
      if (!button || !content || !content.matches(":popover-open")) return;
      const rect = button.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= innerHeight) content.hidePopover();
      else positionPanel(button, content);
    };
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    const observer = new ResizeObserver(update);
    if (trigger.current) observer.observe(trigger.current);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      observer.disconnect();
    };
  }, [open, trigger]);

  return (
    <section className="tag-filter" aria-label={title}>
      <button
        ref={trigger}
        className="tag-filter-trigger"
        type="button"
        popoverTarget={panelId}
        aria-label={`Filter by ${title.toLowerCase()}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-describedby={`${panelId}-status filter-match-hint`}
        onClick={position}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          panel.current?.showPopover();
          const options =
            panel.current?.querySelectorAll<HTMLButtonElement>(
              "[aria-pressed]",
            );
          options?.[
            event.key === "ArrowDown" ? 0 : options.length - 1
          ]?.focus();
        }}
      >
        <span className="tag-filter-label">{title}</span>
        <span className="tag-filter-value" data-selected={selected.length > 0}>
          {selected.length ? (
            <>
              {selected.length}
              <span className="tag-filter-selection-word"> selected</span>
            </>
          ) : (
            "Select…"
          )}
        </span>
        <span id={`${panelId}-status`} className="tag-filter-selection-status">
          {selected.length} {title.toLowerCase()} selected
        </span>
        <svg
          className="tag-filter-chevron"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <path d="m7 10 5 5 5-5" />
        </svg>
      </button>
      <div
        ref={panel}
        id={panelId}
        popover="auto"
        className="tag-filter-panel"
        role="group"
        aria-label={`${title} options`}
        onBeforeToggle={(event) => {
          if (event.newState === "open") position();
        }}
        onToggle={(event) => setOpen(event.newState === "open")}
        onBlur={(event) => {
          const next = event.relatedTarget;
          if (
            next instanceof Node &&
            !event.currentTarget.contains(next) &&
            next !== trigger.current
          )
            panel.current?.hidePopover();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            panel.current?.hidePopover();
            trigger.current?.focus();
            return;
          }
          const options = [
            ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
              "[aria-pressed]",
            ),
          ];
          const index = options.findIndex(
            (option) => option === document.activeElement,
          );
          // Handle reverse Tab before blur so clicking the trigger can still
          // use its native popover toggle without closing and reopening it.
          if (event.key === "Tab" && event.shiftKey && index === 0) {
            event.preventDefault();
            panel.current?.hidePopover();
            trigger.current?.focus();
            return;
          }
          let next: number;
          if (event.key === "ArrowDown") next = (index + 1) % options.length;
          else if (event.key === "ArrowUp")
            next = (index - 1 + options.length) % options.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = options.length - 1;
          else return;
          event.preventDefault();
          options[next]?.focus();
        }}
      >
        <p className="tag-filter-panel-title">{title}</p>
        <div className="tag-filter-options">
          {tags.map((tag) => (
            <button
              type="button"
              className="tag-filter-option"
              key={tag}
              aria-pressed={selected.includes(tag)}
              onClick={() => onToggle(tag)}
            >
              <span className="tag-filter-check" aria-hidden="true">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m4 10 4 4 8-8" />
                </svg>
              </span>
              {tag}
            </button>
          ))}
        </div>
        <div className="tag-filter-footer">
          <span>Select any combination</span>
          <button
            type="button"
            disabled={!selected.length}
            onClick={() => {
              // Clear becomes disabled after this update. Keep focus on an
              // enabled choice so the open panel stays usable by keyboard.
              panel.current
                ?.querySelector<HTMLButtonElement>("[aria-pressed]")
                ?.focus();
              onClear();
            }}
          >
            Clear {title.toLowerCase()}
          </button>
        </div>
      </div>
    </section>
  );
}
