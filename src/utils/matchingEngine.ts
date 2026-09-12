import { CandidateProfile, Job, JobMatchCalculation } from '../types';

/**
 * Standardizes skill names for comparison (case-insensitive, strips symbols)
 */
function normalizeSkill(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\.js$/, '')
    .replace(/[^a-z0-9+#]/g, '');
}

/**
 * Checks if candidate has a specific skill, including semantic aliases
 */
function hasSkill(candidateSkills: string[] = [], requiredSkill: string = ''): boolean {
  if (!candidateSkills || !Array.isArray(candidateSkills) || !requiredSkill) return false;
  const normReq = normalizeSkill(requiredSkill);
  
  const aliases: Record<string, string[]> = {
    'react': ['reactjs', 'react'],
    'reactjs': ['react', 'reactjs'],
    'node': ['nodejs', 'node', 'express'],
    'nodejs': ['node', 'nodejs', 'express'],
    'typescript': ['ts', 'typescript'],
    'javascript': ['js', 'javascript', 'es6'],
    'postgres': ['postgresql', 'sql', 'psql'],
    'postgresql': ['postgres', 'sql', 'psql'],
    'restapi': ['rest', 'restapis', 'restful', 'api', 'apis'],
    'restapis': ['rest', 'restapi', 'restful', 'api', 'apis'],
    'css': ['css3', 'tailwind', 'sass', 'css'],
    'css3': ['css', 'tailwind', 'sass'],
    'html': ['html5', 'html'],
    'html5': ['html', 'html5'],
    'docker': ['containers', 'dockercompose', 'docker'],
    'git': ['github', 'gitlab', 'versioncontrol', 'git'],
    'github': ['git', 'versioncontrol', 'github']
  };

  const allowedAliases = aliases[normReq] || [normReq];

  return candidateSkills.some(cs => {
    if (!cs || typeof cs !== 'string') return false;
    const normCand = normalizeSkill(cs);
    return allowedAliases.includes(normCand) || normCand.includes(normReq) || normReq.includes(normCand);
  });
}

/**
 * Calculates a structured match evaluation between candidate profile and a job posting
 * following the 40% Skills, 20% Education, 15% Experience, 10% Projects, 10% Preferences, 5% Other formula.
 */
export function calculateJobMatch(
  candidate: CandidateProfile,
  job: Job,
  userPreferences?: { preferredLocation?: string; remoteOnly?: boolean; targetRole?: string }
): JobMatchCalculation {
  const allCandidateSkills = candidate.skills?.all || [
    ...(candidate.skills?.programmingLanguages || []),
    ...(candidate.skills?.frameworks || []),
    ...(candidate.skills?.tools || []),
    ...(candidate.skills?.libraries || [])
  ];

  // 1. Skills Matching (Weight: 40%)
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  const allJobRequiredSkills = job.requiredSkills || [];
  allJobRequiredSkills.forEach(req => {
    if (hasSkill(allCandidateSkills, req)) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const skillsMatchRatio = allJobRequiredSkills.length > 0 
    ? matchedSkills.length / allJobRequiredSkills.length 
    : 0.8;
  const skillsScore = skillsMatchRatio * 40;

  // 2. Education Matching (Weight: 20%)
  // Candidates with BS / Degree or relevant coursework
  const educationList = candidate.education || [];
  const hasDegree = educationList.some(edu => 
    (edu.degree || '').toLowerCase().includes('computer science') ||
    (edu.degree || '').toLowerCase().includes('engineering') ||
    (edu.degree || '').toLowerCase().includes('software') ||
    (edu.degree || '').toLowerCase().includes('information technology') ||
    (edu.degree || '').toLowerCase().includes('data')
  );
  const educationScore = hasDegree ? 20 : 14;
  const educationMatch = hasDegree 
    ? `Matches requirements (${educationList[0]?.degree || 'CS/STEM Degree'})` 
    : 'Partial Match (Review technical degree prerequisites)';

  // 3. Experience Level Matching (Weight: 15%)
  let experienceScore = 12;
  const experienceList = candidate.experience || [];
  const candidateExpYears = experienceList.length * 0.8; // Estimate
  if (job.experienceLevel === 'Entry-level' || job.experienceLevel === 'Internship') {
    experienceScore = 15;
  } else if (job.experienceLevel === 'Junior') {
    experienceScore = experienceList.length >= 1 ? 14 : 10;
  } else {
    experienceScore = 8;
  }
  const expLevel = candidate.careerInformation?.experienceLevel || 'Junior';
  const experienceMatch = `${expLevel} profile aligned with ${job.experienceLevel} opening`;

  // 4. Projects Relevance (Weight: 10%)
  let projectScore = 5;
  const projectsList = candidate.projects || [];
  const relevantProjects = projectsList.filter(p => 
    (p.technologies || []).some(t => allJobRequiredSkills.some(req => hasSkill([t], req)))
  );
  if (relevantProjects.length >= 2) {
    projectScore = 10;
  } else if (relevantProjects.length === 1) {
    projectScore = 8;
  }
  const projectRelevance = relevantProjects.length > 0
    ? `${relevantProjects.length} directly related projects (${relevantProjects.map(p => p.projectName).join(', ')}) demonstrate hands-on application.`
    : 'General project portfolio; recommend building a project featuring missing technologies.';

  // 5. Preferences (Location / Remote) (Weight: 10%)
  let preferenceScore = 8;
  if (job.remote) {
    preferenceScore = 10;
  } else if (
    candidate.location &&
    job.location.toLowerCase().includes(candidate.location.split(',')[0].toLowerCase().trim())
  ) {
    preferenceScore = 10;
  } else if (userPreferences?.remoteOnly && !job.remote) {
    preferenceScore = 3;
  }

  // 6. Other Factors (Certifications, Soft Skills) (Weight: 5%)
  let otherScore = 3;
  if (candidate.certifications && candidate.certifications.length > 0) {
    otherScore = 5;
  }

  // Total Score (0 - 100)
  const totalScore = Math.min(
    100,
    Math.max(15, Math.round(skillsScore + educationScore + experienceScore + projectScore + preferenceScore + otherScore))
  );

  let grade: 'Excellent Match' | 'Strong Match' | 'Moderate Match' | 'Low Match' = 'Low Match';
  if (totalScore >= 90) {
    grade = 'Excellent Match';
  } else if (totalScore >= 75) {
    grade = 'Strong Match';
  } else if (totalScore >= 60) {
    grade = 'Moderate Match';
  }

  // Transparent explanation
  let explanation = '';
  if (matchedSkills.length > 0 && missingSkills.length > 0) {
    explanation = `Your ${matchedSkills.slice(0, 4).join(', ')} skills align with core role prerequisites. Adding ${missingSkills.slice(0, 2).join(' and ')} would strengthen your profile for this specific role.`;
  } else if (matchedSkills.length > 0 && missingSkills.length === 0) {
    explanation = `Outstanding alignment! You satisfy all core technical prerequisites (${matchedSkills.join(', ')}) with relevant project proof.`;
  } else {
    explanation = `Role requires distinct specialization (${job.requiredSkills.join(', ')}). Consider reviewing required skills before applying.`;
  }

  const recommendations: string[] = [];
  if (missingSkills.length > 0) {
    recommendations.push(`Familiarize yourself with ${missingSkills.slice(0, 3).join(', ')} prior to screening.`);
  }
  if (relevantProjects.length > 0) {
    recommendations.push(`Highlight your ${relevantProjects[0].projectName} project in your application cover letter.`);
  }
  recommendations.push('Tailor your CV summary to emphasize key keywords from the job description.');

  return {
    jobId: job.id,
    score: totalScore,
    grade,
    matchedSkills,
    missingSkills,
    educationMatch,
    experienceMatch,
    projectRelevance,
    explanation,
    recommendations
  };
}
