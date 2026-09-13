export type Credibility = "high" | "medium" | "ai";

export interface SkillGroups {
  required: string[];
  bonus: string[];
  standards: string[];
}

export interface Resource {
  name: string;
  url: string;
}

export interface Stage {
  id: string;
  title: string;
  duration: string;
  tasks: string[];
  deliverable: string;
  standard: string;
  resources: Resource[];
}

export interface InterviewItem {
  id: string;
  question: string;
  tags: string[];
  source: string;
  credibility: Credibility;
  answer: string;
}

export interface CourseItem {
  id: string;
  title: string;
  platform: string;
  level: string;
  why: string;
  url: string;
}

export interface RoleContent {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  summary: string;
  skills: SkillGroups;
  stages: Stage[];
  interviews: InterviewItem[];
  courses: CourseItem[];
}
