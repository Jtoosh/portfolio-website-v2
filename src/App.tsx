import { portfolio, projects, type Project } from "./content";

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

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project">
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
  );
}

export function App() {
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
            {portfolio.introductionTodo && (
              <p className="todo">{portfolio.introductionTodo}</p>
            )}
          </section>
          {/* Skill discovery belongs here, before the project results. */}
          <section
            className="projects-section"
            aria-labelledby="projects-heading"
          >
            <div className="section-heading">
              <h2 id="projects-heading">Featured projects</h2>
              <span>A few things I've built</span>
            </div>
            <div className="project-list">
              {projects
                .filter((project) => project.featured)
                .sort((a, b) => a.order - b.order)
                .map((project) => (
                  <ProjectCard project={project} key={project.id} />
                ))}
            </div>
          </section>
          <section
            className="current-work"
            aria-labelledby="current-work-heading"
          >
            <h2 id="current-work-heading">Current work</h2>
            {portfolio.currentWork && <p>{portfolio.currentWork}</p>}
            {portfolio.currentWorkTodo && (
              <p className="todo">{portfolio.currentWorkTodo}</p>
            )}
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
