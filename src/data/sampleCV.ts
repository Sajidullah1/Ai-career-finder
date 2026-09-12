import { CVAnalysisResult } from '../types';

export const SAMPLE_CV_RAW_TEXT = `ALEX CHEN
San Francisco, CA | (415) 555-0192 | alex.chen.dev@gmail.com
LinkedIn: linkedin.com/in/alexchen-tech | GitHub: github.com/alexchen-dev | Portfolio: alexchen.dev

PROFESSIONAL SUMMARY
Motivated and detail-oriented Computer Science graduate with solid hands-on experience building full-stack web applications using React, TypeScript, Node.js, and REST APIs. Passionate about clean architecture, responsive user interfaces, and collaborative software engineering. Looking for an entry-level / junior software engineering role.

EDUCATION
University of California, Davis (UC Davis)
Bachelor of Science in Computer Science | Minor in Statistics
Graduation: June 2026 | GPA: 3.72 / 4.00
Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Web Development, Database Systems, Operating Systems, Software Engineering.

TECHNICAL SKILLS
- Programming Languages: TypeScript, JavaScript (ES6+), Python, SQL (PostgreSQL, MySQL), HTML5, CSS3/Sass
- Frontend Frameworks & Libraries: React, Tailwind CSS, Redux Toolkit, Next.js, Vite
- Backend & APIs: Node.js, Express.js, RESTful API Design, JSON, JWT Authentication
- Databases & Storage: PostgreSQL, MongoDB, Redis, Supabase
- Tools & DevOps: Git, GitHub, Docker (basics), Postman, Linux/Bash, VS Code
- Soft Skills: Agile/Scrum, Technical Writing, Problem Solving, Cross-Functional Teamwork

SOFTWARE PROJECTS
DevCollab - Real-Time Developer Collaboration Board
- Architected and deployed a collaborative kanban board application using React, TypeScript, and Tailwind CSS.
- Built a Node.js/Express REST backend handling user authentication, project workspaces, and task state.
- Integrated PostgreSQL with Prisma ORM, reducing database query response times by 35%.
- Implemented responsive mobile-first UI with 100% WCAG AA contrast compliance.

CampusBite - Campus Food Discovery Platform
- Developed a web application helping university students find affordable on-campus dining with dietary filters.
- Built interactive frontend with React and Vite; integrated Google Maps API for real-time restaurant markers.
- Implemented debounced search and multi-criteria filtering across 80+ restaurant menus.
- Unit tested critical utility modules using Vitest with 88% branch coverage.

SmartExpense - Personal Finance Tracker
- Built an automated budgeting dashboard using React, Chart.js, and Express.
- Designed REST endpoints to parse and categorize CSV bank statement exports.
- Implemented secure JWT session authentication and bcrypt password hashing.

WORK & LEADERSHIP EXPERIENCE
Undergraduate Teaching Assistant - Web Development (CS 32) | UC Davis
September 2025 - Present | Davis, CA
- Mentored 65+ undergraduate students in JavaScript fundamentals, DOM manipulation, and React component lifecycle.
- Conducted weekly laboratory sessions, graded code submissions, and provided debugging guidance.

Web Developer Intern | TechForward Student Agency
June 2025 - August 2025 | Remote
- Refactored 12 client landing pages using modern React and Tailwind CSS, improving Lighthouse performance score from 68 to 94.
- Implemented cross-browser compatibility and responsive layouts tested across iOS, Android, and Desktop.

CERTIFICATIONS
- Meta Frontend Developer Professional Certificate (Coursera) - 2025
- Postman API Fundamentals Student Expert - 2025`;

export const SAMPLE_ANALYSIS_RESULT: CVAnalysisResult = {
  id: 'demo-analysis-alex-chen',
  analyzedAt: new Date().toISOString(),
  sourceFileName: 'Alex_Chen_Software_Engineer_CV.pdf',
  candidate: {
    name: 'Alex Chen',
    email: 'alex.chen.dev@gmail.com',
    phone: '(415) 555-0192',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen-tech',
    github: 'github.com/alexchen-dev',
    portfolio: 'alexchen.dev',
    summary: 'Motivated and detail-oriented Computer Science graduate with solid hands-on experience building full-stack web applications using React, TypeScript, Node.js, and REST APIs.',
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        university: 'University of California, Davis',
        graduationStatus: 'Graduated',
        graduationYear: '2026',
        gradeOrGpa: '3.72 / 4.00'
      }
    ],
    skills: {
      programmingLanguages: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML5', 'CSS3'],
      frameworks: ['React', 'Next.js', 'Express.js', 'Tailwind CSS', 'Redux Toolkit'],
      libraries: ['Vite', 'Chart.js', 'Prisma ORM'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis', 'Supabase'],
      tools: ['Git', 'GitHub', 'Postman', 'Docker', 'Linux', 'VS Code'],
      cloudTechnologies: ['Supabase', 'Vercel'],
      softSkills: ['Agile/Scrum', 'Technical Writing', 'Problem Solving', 'Team Mentorship'],
      all: [
        'React', 'TypeScript', 'Node.js', 'JavaScript', 'Python', 'SQL', 'PostgreSQL',
        'Tailwind CSS', 'REST APIs', 'Git', 'GitHub', 'Express', 'MongoDB', 'Docker',
        'Next.js', 'HTML5', 'CSS3', 'Agile', 'Testing'
      ]
    },
    experience: [
      {
        company: 'UC Davis CS Department',
        position: 'Undergraduate Teaching Assistant - Web Development',
        duration: 'Sept 2025 - Present',
        responsibilities: [
          'Mentored 65+ students in JavaScript, DOM APIs, and React component hierarchies',
          'Conducted weekly lab sessions and code reviews'
        ],
        achievements: ['Awarded Departmental Student Recognition for Teaching Excellence']
      },
      {
        company: 'TechForward Student Agency',
        position: 'Web Developer Intern',
        duration: 'June 2025 - August 2025',
        responsibilities: [
          'Refactored client landing pages using modern React and Tailwind CSS',
          'Conducted responsive testing across mobile and desktop viewpoints'
        ],
        achievements: ['Improved client Lighthouse performance score from 68 to 94']
      }
    ],
    projects: [
      {
        projectName: 'DevCollab',
        description: 'Real-time collaborative developer workspace and Kanban board with workspace permissions.',
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
        impact: 'Reduced database query response time by 35% with Prisma connection pooling.'
      },
      {
        projectName: 'CampusBite',
        description: 'Campus dining discovery web application with interactive restaurant markers and dietary filters.',
        technologies: ['React', 'Vite', 'Google Maps API', 'Vitest'],
        impact: 'Achieved 88% unit test branch coverage and indexed 80+ campus venues.'
      },
      {
        projectName: 'SmartExpense',
        description: 'Automated personal finance tracking dashboard with CSV statement parsing and JWT auth.',
        technologies: ['React', 'Express', 'Chart.js', 'PostgreSQL'],
        impact: 'Securely parsed over 500 transaction records with dynamic categorization.'
      }
    ],
    certifications: [
      {
        certificationName: 'Meta Frontend Developer Professional Certificate',
        organization: 'Coursera / Meta',
        date: '2025'
      },
      {
        certificationName: 'Postman API Fundamentals Student Expert',
        organization: 'Postman',
        date: '2025'
      }
    ],
    careerInformation: {
      likelyJobRoles: [
        'Junior Full-Stack Developer',
        'Associate Frontend Engineer',
        'Junior Software Engineer',
        'Web Applications Developer'
      ],
      careerInterests: ['Full-Stack Web Development', 'SaaS Products', 'API Architecture', 'Developer Tooling'],
      experienceLevel: 'Junior'
    }
  },
  cvScore: {
    overall: 84,
    skills: 88,
    experience: 78,
    projects: 92,
    education: 90,
    structure: 86,
    relevance: 85,
    completeness: 88,
    ats: 82,
    explanations: {
      skills: 'Strong combination of in-demand modern frontend and backend technologies (React, TypeScript, Node.js, SQL).',
      experience: 'Good foundational internship and teaching assistant experience; would benefit from expanding commercial production impact metrics.',
      projects: 'Exceptional full-stack projects featuring clear problem statements, modern tech stacks, and quantifiable performance outcomes.',
      education: 'Relevant BS in Computer Science with a strong 3.72 GPA from an accredited university.',
      structure: 'Clean, chronological layout with distinct sections and professional contact information.',
      ats: 'Parses smoothly with standard headings, though some bullet points could emphasize industry standard keywords more explicitly.'
    }
  },
  strengths: [
    {
      title: 'Strong Full-Stack Core Foundations',
      description: 'Demonstrated proficiency in the modern TypeScript ecosystem spanning React, Node.js, Express, and PostgreSQL.',
      evidence: 'Proven through both course work, internship deliverables, and 3 deployed web projects.'
    },
    {
      title: 'Quantified Project Accomplishments',
      description: 'Your project bullet points effectively cite measurable impact rather than just listing basic tasks.',
      evidence: 'E.g., "reduced query response times by 35%" and "improved Lighthouse performance score from 68 to 94".'
    },
    {
      title: 'Relevant Technical Mentorship Experience',
      description: 'Working as a Teaching Assistant highlights strong communication, code review abilities, and teamwork.',
      evidence: 'Mentored 65+ students in JavaScript and software development principles.'
    },
    {
      title: 'Active Industry Certifications',
      description: 'Credentials from Meta and Postman validate foundational knowledge of industry-standard tools and API patterns.',
      evidence: 'Meta Frontend Certificate and Postman Student Expert.'
    }
  ],
  weaknesses: [
    {
      problem: 'Limited Cloud & DevOps Infrastructure Exposure',
      whyItMatters: 'Most modern engineering teams expect junior engineers to understand containerization (Docker), CI/CD workflows, and cloud deployments (AWS/GCP).',
      howToImprove: 'Add a Docker container configuration to your DevCollab repository and configure a GitHub Actions CI pipeline.',
      section: 'Skills & Projects'
    },
    {
      problem: 'Summary Statement Is Generic',
      whyItMatters: 'Recruiters spend 6 seconds scanning resumes; a generic summary misses an opportunity to pitch your distinctive tech stack value proposition.',
      howToImprove: 'Highlight specific full-stack technologies (React, TypeScript, Node) and your core technical achievement directly in the first two sentences.',
      section: 'Professional Summary'
    },
    {
      problem: 'No Mention of Automated Testing in Main Work Experience',
      whyItMatters: 'Hiring managers prize entry-level candidates who write testable code and care about software reliability.',
      howToImprove: 'Mention unit or integration testing tools (Vitest/Jest, React Testing Library) within your internship or TA bullets.',
      section: 'Experience'
    }
  ],
  formatAnalysis: [
    {
      area: 'Section Structure & Hierarchy',
      status: 'good',
      feedback: 'Logical flow: Summary → Education → Skills → Projects → Experience → Certifications.'
    },
    {
      area: 'ATS Readability & Standard Headers',
      status: 'good',
      feedback: 'Clean standard headers parse accurately without conflicting graphics or column splits.'
    },
    {
      area: 'Contact Information Completeness',
      status: 'good',
      feedback: 'Phone, location, email, LinkedIn, GitHub, and portfolio link are all present.'
    },
    {
      area: 'Keyword Density for Full-Stack Roles',
      status: 'needs_improvement',
      feedback: 'Missing several frequently filtered keywords: "Docker", "CI/CD", "Automated Testing", "Cloud".'
    },
    {
      area: 'Bullet Point Consistency',
      status: 'needs_improvement',
      feedback: 'A few bullets under Teaching Assistant describe duties rather than achievements. Use action verbs.'
    },
    {
      area: 'Page Length & Margins',
      status: 'good',
      feedback: 'Ideal single-page length for a candidate with under 3 years of commercial experience.'
    }
  ],
  improvements: [
    {
      section: 'Professional Summary',
      currentContent: 'Motivated and detail-oriented Computer Science graduate with solid hands-on experience building full-stack web applications using React, TypeScript, Node.js, and REST APIs. Looking for an entry-level software engineering role.',
      suggestedContent: 'Results-driven Full-Stack Developer and UC Davis CS graduate (3.72 GPA) specialized in React, TypeScript, and Node.js microservices. Experienced in building responsive web applications that boost performance by up to 38% and mentoring 65+ developers. Seeking a Junior Software Engineer position to deliver scalable, reliable web solutions.',
      reason: 'Elevates your GPA, emphasizes quantifiable performance impact, and clearly states your specialization upfront.'
    },
    {
      section: 'Experience (Teaching Assistant)',
      currentContent: 'Mentored 65+ students in JavaScript, DOM APIs, and React component hierarchies. Conducted weekly lab sessions and code reviews.',
      suggestedContent: 'Instructed and mentored 65+ computer science undergraduates in modern JavaScript (ES6+), React component architecture, and debugging workflows, achieving a 94% student lab completion rate.',
      reason: 'Replaces passive duty wording with active verb ("Instructed") and incorporates a concrete success metric.'
    },
    {
      section: 'Skills Formatting',
      currentContent: 'Tools & DevOps: Git, GitHub, Docker (basics), Postman, Linux/Bash, VS Code',
      suggestedContent: 'DevOps & Tooling: Git/GitHub (Branching, PR Reviews), Docker, GitHub Actions (CI/CD), Postman API Testing, Linux/Bash',
      reason: 'Removes weakening qualifiers like "(basics)" and incorporates high-demand keywords like CI/CD and API Testing.'
    }
  ],
  skillGaps: [
    {
      skill: 'Docker & Containerization',
      priority: 'High',
      reason: 'Present in over 70% of junior backend and full-stack job listings to ensure local-to-production reproducibility.',
      recommendedAction: 'Containerize your DevCollab backend and frontend with Docker Compose and document the setup in your README.'
    },
    {
      skill: 'CI/CD Pipelines (GitHub Actions)',
      priority: 'High',
      reason: 'Demonstrates professional workflow maturity: automated linting, test execution, and preview deployments.',
      recommendedAction: 'Set up a GitHub Actions workflow to run ESLint and Vitest automatically on every pull request.'
    },
    {
      skill: 'Automated Testing (Cypress / Playwright / RTL)',
      priority: 'Medium',
      reason: 'Companies look for engineers who can safeguard production code with automated end-to-end regression tests.',
      recommendedAction: 'Write 3 Cypress or Playwright end-to-end tests for your CampusBite search and filtering flow.'
    },
    {
      skill: 'Cloud Deployment (AWS / GCP Fundamentals)',
      priority: 'Medium',
      reason: 'Understanding how cloud serverless functions, S3 buckets, and managed databases operate differentiates entry-level candidates.',
      recommendedAction: 'Deploy one service to AWS ECS/EC2 or Google Cloud Run using an automated CI pipeline.'
    },
    {
      skill: 'State Management at Scale (Zustand / TanStack Query)',
      priority: 'Low',
      reason: 'Modern production React applications increasingly prefer server-state management over boilerplate Redux.',
      recommendedAction: 'Implement TanStack Query (React Query) for data caching in your next full-stack project.'
    }
  ],
  learningRoadmap: [
    {
      id: 'roadmap-week-1',
      week: 1,
      title: 'Containerization with Docker & Docker Compose',
      description: 'Master container fundamentals, writing multi-stage Dockerfiles for React/Node, and linking services with docker-compose.',
      keySkills: ['Docker', 'Dockerfile', 'Docker Compose', 'Container Networking'],
      projectIdea: 'Create a docker-compose.yml that spins up your Express server, React client, and a PostgreSQL database with a single command.',
      completed: true
    },
    {
      id: 'roadmap-week-2',
      week: 2,
      title: 'Automated CI/CD with GitHub Actions',
      description: 'Automate code quality checks, TypeScript validation, and automated test runners on every commit.',
      keySkills: ['GitHub Actions', 'YAML workflows', 'Automated Testing', 'Linting'],
      projectIdea: 'Build a reusable CI pipeline that checks formatting, runs unit tests, and rejects failing PRs automatically.',
      completed: false
    },
    {
      id: 'roadmap-week-3',
      week: 3,
      title: 'End-to-End Testing with Playwright or Cypress',
      description: 'Learn integration and E2E testing strategies for critical user journeys: sign-in, creating tasks, and navigation.',
      keySkills: ['Playwright', 'E2E Testing', 'Mock Service Worker (MSW)', 'Test Assertions'],
      projectIdea: 'Write 5 comprehensive end-to-end tests for the DevCollab task board flow.',
      completed: false
    },
    {
      id: 'roadmap-week-4',
      week: 4,
      title: 'Cloud Infrastructure & Managed Deployment',
      description: 'Deploy containerized web applications to cloud infrastructure (Google Cloud Run or AWS) with custom domains and SSL.',
      keySkills: ['Google Cloud Run', 'AWS ECS/App Runner', 'Environment Secrets', 'Cloud Logging'],
      projectIdea: 'Deploy your containerized project to Cloud Run, configure production environment variables, and verify live uptime.',
      completed: false
    },
    {
      id: 'roadmap-week-5',
      week: 5,
      title: 'Advanced API Architecture & Caching (Redis)',
      description: 'Implement distributed in-memory caching for expensive queries, rate limiting, and webhook integrations.',
      keySkills: ['Redis', 'Cache Invalidation', 'Rate Limiting', 'Express Middleware'],
      projectIdea: 'Add Redis caching to the search endpoint of CampusBite to achieve sub-15ms query latencies.',
      completed: false
    }
  ],
  targetJobRoles: [
    'Junior Full-Stack Developer',
    'Associate Frontend Engineer',
    'Junior Software Engineer',
    'Web Applications Developer'
  ]
};
