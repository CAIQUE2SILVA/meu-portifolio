export interface Project {
  id: string;
  titleKey: string;
  stack: string[];
  descriptionKey: string;
  implementationKey: string;
  benefitKey: string;
  repoUrl?: string;
  demoUrl?: string;
}
