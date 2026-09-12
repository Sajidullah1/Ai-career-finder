export interface CandidateProfile {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary?: string;
  education: EducationItem[];
  skills: {
    programmingLanguages: string[];
    frameworks: string[];
    libraries?: string[];
    databases: string[];
    tools: string[];
    cloudTechnologies: string[];
    softSkills: string[];
    all: string[];
  };
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  careerInformation: {
    likelyJobRoles: string[];
    careerInterests: string[];
    experienceLevel: 'Entry-level' | 'Junior' | 'Mid-level' | 'Senior' | 'Internship';
  };
}

export interface EducationItem {
  degree: string;
  university: string;
  graduationStatus: 'Graduated' | 'In Progress' | 'Expected';
  graduationYear: string;
  gradeOrGpa?: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  responsibilities: string[];
  achievements?: string[];
}

export interface ProjectItem {
  projectName: string;
  description: string;
  technologies: string[];
  impact?: string;
  link?: string;
}

export interface CertificationItem {
  certificationName: string;
  organization: string;
  date: string;
}

export interface CVScoreBreakdown {
  overall: number;
  skills: number;
  experience: number;
  projects: number;
  education: number;
  structure: number;
  relevance: number;
  completeness: number;
  ats: number;
  explanations: {
    skills: string;
    experience: string;
    projects: string;
    education: string;
    structure: string;
    ats: string;
  };
}

export interface CVStrength {
  title: string;
  description: string;
  evidence: string;
}

export interface CVWeakness {
  problem: string;
  whyItMatters: string;
  howToImprove: string;
  section: string;
}

export interface CVFormatAnalysisItem {
  area: string;
  status: 'good' | 'needs_improvement' | 'critical';
  feedback: string;
}

export interface CVImprovement {
  section: string;
  currentContent: string;
  suggestedContent: string;
  reason: string;
}

export interface SkillGapItem {
  skill: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  recommendedAction: string;
}

export interface RoadmapMilestone {
  id: string;
  week: number;
  title: string;
  description: string;
  keySkills: string[];
  projectIdea: string;
  completed: boolean;
}

export interface CVAnalysisResult {
  id: string;
  analyzedAt: string;
  sourceFileName?: string;
  candidate: CandidateProfile;
  cvScore: CVScoreBreakdown;
  strengths: CVStrength[];
  weaknesses: CVWeakness[];
  formatAnalysis: CVFormatAnalysisItem[];
  improvements: CVImprovement[];
  skillGaps: SkillGapItem[];
  learningRoadmap: RoadmapMilestone[];
  targetJobRoles: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experienceLevel: 'Entry-level' | 'Junior' | 'Mid-level' | 'Senior' | 'Internship';
  description: string;
  responsibilities?: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirements: string;
  deadline?: string; // ISO date string or undefined if not provided
  source: string;
  applyUrl: string;
  postedDate: string;
  lastChecked: string;
  salary?: string;
  isDemo?: boolean;
}

export interface JobMatchCalculation {
  jobId: string;
  score: number; // 0 - 100
  grade: 'Excellent Match' | 'Strong Match' | 'Moderate Match' | 'Low Match';
  matchedSkills: string[];
  missingSkills: string[];
  educationMatch: boolean | string;
  experienceMatch: boolean | string;
  projectRelevance: string;
  explanation: string;
  recommendations: string[];
}

export type ApplicationStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface SavedJobRecord {
  jobId: string;
  savedAt: string;
  notes?: string;
  status?: ApplicationStatus;
}

export interface LearningRoadmapStep {
  week: number;
  title: string;
  focusDescription: string;
  skillsToLearn: string[];
  estimatedHours: number;
  completed: boolean;
  miniProject: {
    title: string;
    description: string;
    deliverable: string;
  };
  resources: Array<{
    title: string;
    url: string;
    type: 'documentation' | 'tutorial' | 'video' | 'course';
  }>;
  howToAddToCV: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  targetJobTitle?: string;
  workType?: 'Remote' | 'On-site' | 'Hybrid';
  experienceLevel?: 'Student' | 'Fresh Graduate' | 'Intern' | 'Junior' | 'Mid-level';
  createdAt?: string;
  preferences?: {
    targetRole?: string;
    preferredLocation?: string;
    remoteOnly?: boolean;
    jobType?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
