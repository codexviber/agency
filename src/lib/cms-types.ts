export type SocialLink = { label: string; url: string };

export type ApproachStep = { title: string; body: string };

export type AgencySettings = {
  name: string;
  tagline: string;
  heroIntro: string;
  aboutTitle: string;
  aboutBody: string;
  approach: ApproachStep[];
  email: string;
  phone: string;
  location: string;
  socials: SocialLink[];
};

export type Person = {
  id: string;
  name: string;
  role: string;
  accent: "red" | "blue";
  bio: string;
  portfolioUrl: string;
  photoUrl: string;
  socials: SocialLink[];
};

export type Service = {
  id: number;
  title: string;
  description: string;
  icon: string;
  detailsUrl: string;
  visible: boolean;
};

export type Project = {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string;
  demoUrl: string;
  githubUrl: string;
  coverData: string;
  videoUrl: string;
  published: boolean;
};

export type Inquiry = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "archived";
  createdAt: string;
};

export type PublicSite = {
  agency: AgencySettings;
  people: Person[];
  services: Service[];
  projects: Project[];
};

export type AdminBundle = PublicSite & {
  allServices: Service[];
  allProjects: Project[];
  inquiries: Inquiry[];
  counts: {
    publishedProjects: number;
    draftProjects: number;
    newInquiries: number;
    services: number;
  };
};
