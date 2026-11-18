import { useRef } from "react";
import { TagFilter, type TagFilterProps } from "./TagFilter";
import type { LanguageTag, SkillTag } from "./content";
import "./ProjectFilters.css";

type ProjectFiltersProps = {
  skills: TagFilterProps<SkillTag>;
  languages: TagFilterProps<LanguageTag>;
};

export function ProjectFilters({ skills, languages }: ProjectFiltersProps) {
  const skillsTrigger = useRef<HTMLButtonElement>(null);
  const languagesTrigger = useRef<HTMLButtonElement>(null);
  const hasSelections = skills.selected.length + languages.selected.length > 0;
  return (
    <div className="project-filters">
      <p className="filter-section-label">Explore by expertise</p>
      <div className="filter-pair">
        <TagFilter {...skills} triggerRef={skillsTrigger} />
        <TagFilter {...languages} triggerRef={languagesTrigger} />
      </div>
      <div className="filter-selection-wrap" data-active={hasSelections}>
        <div className="filter-selection-clip">
          <div
            className="filter-selections"
            role="group"
            aria-label="Active filters"
          >
            {skills.selected.map((tag) => (
              <button
                type="button"
                key={tag}
                aria-label={`Remove skill: ${tag}`}
                onClick={() => {
                  skills.onToggle(tag);
                  skillsTrigger.current?.focus();
                }}
              >
                {tag}
                <span aria-hidden="true">×</span>
              </button>
            ))}
            {languages.selected.map((tag) => (
              <button
                type="button"
                key={tag}
                aria-label={`Remove language: ${tag}`}
                onClick={() => {
                  languages.onToggle(tag);
                  languagesTrigger.current?.focus();
                }}
              >
                {tag}
                <span aria-hidden="true">×</span>
              </button>
            ))}
            {hasSelections && (
              <button
                type="button"
                className="filter-reset"
                aria-label="Clear all filters"
                onClick={() => {
                  skills.onClear();
                  languages.onClear();
                  skillsTrigger.current?.focus();
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="filter-match-hint" id="filter-match-hint">
        Projects must match every selected skill and language.
      </p>
    </div>
  );
}
