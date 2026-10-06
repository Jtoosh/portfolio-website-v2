export interface Project {
  id: string;
  name: string;
  summary: string;
  repository: string;
  tags: string[];
  featured: boolean;
  education: boolean;
  order: number;
}

export const portfolio = {
  name: "James Teuscher",
  role: "Software engineer & computer science student",
  introduction:
    "I'm James, a software engineer and computer science student. I'm naturally curious, and I learn by building—across web, backend, native apps, and infrastructure. I care about steadily improving my craft and making useful things.",
  introductionTodo: "TODO: Replace this introduction with my own writing.",
  currentWork: "",
  currentWorkTodo:
    "TODO: Describe the motivation and vision behind what I'm working on now.",
  contacts: {
    email: "mailto:james.teuscher@outlook.com",
    resume:
      "https://mega.nz/file/cJxC2CrD#r9PMHAd4utssUWPVjPUyhGsuXkUcNAIPQq3hOOZXZNA",
    linkedin: "https://www.linkedin.com/in/james-teuscher-871a69316",
    github: "https://github.com/jtoosh",
  },
};

export const projects: Project[] = [
  {
    id: "exercise-app",
    name: "Exercise App",
    summary:
      "A workout planner built around my own gym routine, with workout generation, exercise logging, a rest timer, and saved workout history. I've used feedback from real workouts to refine the app and its scope.",
    repository: "https://github.com/Jtoosh/exercise-app",
    tags: ["React", "TypeScript", "Bun", "SQL", "PostgreSQL"],
    featured: true,
    education: false,
    order: 1,
  },
  {
    id: "note-of-the-day",
    name: "Note of the Day",
    summary:
      "An experiment in bringing small learning snippets into everyday life, including a native macOS widget scaffold. Built with extensive Codex assistance; my work involved prompting, reviewing, and testing the result.",
    repository: "https://github.com/Jtoosh/note-of-the-day",
    tags: ["Swift", "SwiftUI", "WidgetKit"],
    featured: true,
    education: false,
    order: 2,
  },
  {
    id: "tweeter",
    name: "Tweeter",
    summary:
      "A course-built social application with an AWS backend. My work included backend endpoints, asynchronous feed updates, infrastructure configuration, and debugging request handling.",
    repository: "https://github.com/Jtoosh/byu-cs340",
    tags: ["TypeScript", "AWS", "Terraform", "DynamoDB", "SQS"],
    featured: true,
    education: true,
    order: 3,
  },
];
