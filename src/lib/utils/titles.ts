/**
 * Utility untuk manajemen gelar (Title) Professional Berdasarkan Level
 */

export const getProfessionalTitle = (level: number) => {
  if (level >= 5) return 'Principal Control Architect';
  if (level >= 4) return 'Lead Systems Integrator';
  if (level >= 3) return 'Senior Automation Engineer';
  if (level >= 2) return 'Automation Specialist';
  return 'Junior Automation Technician';
};

export const getLevelLabel = (level: number) => {
  if (level >= 5) return 'Level 5 Expert';
  if (level >= 4) return 'Level 4 Mastery';
  if (level >= 3) return 'Level 3 Advanced';
  if (level >= 2) return 'Level 2 Intermediate';
  return 'Level 1 Beginner';
};
