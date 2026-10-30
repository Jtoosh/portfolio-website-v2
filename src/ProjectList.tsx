import { useEffect, useRef } from "react";
import type { Project } from "./content";

export function ProjectList({ projects }: { projects: Project[] }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    list.scrollTop = 0;
    const cards = Array.from(list.children).slice(0, 3);
    // Measure complete cards so longer copy and narrow screens never cut one off.
    const resize = () => {
      const height = cards.reduce(
        (total, card) => total + card.getBoundingClientRect().height,
        0,
      );
      list.style.maxHeight = `${Math.ceil(height) + 2}px`;
    };
    const observer = new ResizeObserver(resize);
    cards.forEach((card) => observer.observe(card));
    resize();
    return () => observer.disconnect();
  }, [projects]);

  return (
    <div
      ref={listRef}
      className="project-list"
      role="region"
      aria-label="Project list"
      aria-describedby="project-list-hint"
      tabIndex={0}
    >
      {projects.map((project) => (
        <article className="project" key={project.id}>
          <div className="project-heading">
            <h3>{project.name}</h3>
            {project.education && <span className="education">Education</span>}
          </div>
          <p>{project.summary}</p>
          <ul className="project-tags" aria-label={`${project.name} skills`}>
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <a className="repository-link" href={project.repository}>
            View {project.name} repository <span aria-hidden="true">↗</span>
          </a>
        </article>
      ))}
    </div>
  );
}
