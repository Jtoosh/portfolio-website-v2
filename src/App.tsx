import { useState } from "react";
import { Activity } from "./Activity";
import { portfolio, projects, skillTags, type SkillTag } from "./content";
import { ProjectList } from "./ProjectList";

function ContactLinks() {
  return (
    <nav aria-label="Contact links">
      <a className="email-link" href={portfolio.contacts.email}>
        Email me <span aria-hidden="true">↗</span>
      </a>
      <a href={portfolio.contacts.resume}>Resume</a>
      <a href={portfolio.contacts.linkedin}>LinkedIn</a>
      <a href={portfolio.contacts.github}>GitHub</a>
    </nav>
  );
}

export function App() {
  const [selectedSkills, setSelectedSkills] = useState<SkillTag[]>([]);
  const visibleProjects = projects.filter((project) => project.visible);
  const skills = skillTags.filter((tag) =>
    visibleProjects.some((project) => project.tags.includes(tag)),
  );
  const matchingProjects = visibleProjects
    .filter((project) =>
      selectedSkills.length
        ? project.tags.some((tag) => selectedSkills.includes(tag))
        : true,
    )
    .sort(
      (a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order,
    );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="page-shell">
        <header className="site-header">
          <a
            className="wordmark"
            href="#main"
            aria-label="James Teuscher, introduction"
          >
            JT<span aria-hidden="true">.</span>
          </a>
          <ContactLinks />
        </header>
        <main id="main">
          <section className="introduction" aria-labelledby="intro-heading">
            <p className="eyebrow">Building useful things. Always learning.</p>
            <h1 id="intro-heading">{portfolio.name}</h1>
            <p className="role">{portfolio.role}</p>
            <p className="intro-copy">{portfolio.introduction}</p>
          </section>
          <section className="skills-section" aria-labelledby="skills-heading">
            <h2 id="skills-heading">Skills</h2>
            <p>Click a skill to see what I've done with it.</p>
            <div className="skill-badges">
              {skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  aria-pressed={selectedSkills.includes(skill)}
                  onClick={() =>
                    setSelectedSkills((selected) =>
                      selected.includes(skill)
                        ? selected.filter((tag) => tag !== skill)
                        : [...selected, skill],
                    )
                  }
                >
                  {skill}
                </button>
              ))}
              <button
                type="button"
                className="clear-skills"
                disabled={!selectedSkills.length}
                onClick={() => setSelectedSkills([])}
              >
                Clear skills
              </button>
            </div>
          </section>
          <section
            className="projects-section"
            aria-labelledby="projects-heading"
          >
            <div className="section-heading">
              <h2 id="projects-heading">
                {selectedSkills.length ? "Matching projects" : "Projects"}
              </h2>
              <span role="status">
                {matchingProjects.length}{" "}
                {matchingProjects.length === 1 ? "project" : "projects"}
              </span>
            </div>
            <p className="project-list-hint" id="project-list-hint">
              Personal projects and coursework. Scroll to explore the list.
            </p>
            <ProjectList projects={matchingProjects} />
          </section>
          <section
            className="current-work"
            aria-labelledby="current-work-heading"
          >
            <h2 id="current-work-heading">Current work</h2>
            {portfolio.currentWork && <p>{portfolio.currentWork}</p>}
            <Activity />
          </section>
        </main>
        <footer className="site-footer">
          <p>
            Have something in mind?{" "}
            <a href={portfolio.contacts.email}>
              Let's talk <span aria-hidden="true">↗</span>
            </a>
          </p>
          <span>{portfolio.name}</span>
        </footer>
      </div>
    </>
  );
}
