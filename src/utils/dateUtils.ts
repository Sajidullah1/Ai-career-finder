/**
 * Formats job application deadline into a human-readable countdown status
 */
export function formatDeadlineStatus(deadlineStr?: string): {
  label: string;
  isUrgent: boolean;
  isExpired: boolean;
  rawDateFormatted?: string;
} {
  if (!deadlineStr) {
    return {
      label: 'Deadline not provided',
      isUrgent: false,
      isExpired: false
    };
  }

  const deadline = new Date(deadlineStr);
  if (isNaN(deadline.getTime())) {
    return {
      label: 'Deadline not provided',
      isUrgent: false,
      isExpired: false
    };
  }

  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  const rawDateFormatted = deadline.toLocaleDateString('en-US', options);

  if (diffDays < 0) {
    return {
      label: 'Expired',
      isUrgent: false,
      isExpired: true,
      rawDateFormatted
    };
  }

  if (diffDays === 0) {
    return {
      label: 'Deadline today',
      isUrgent: true,
      isExpired: false,
      rawDateFormatted
    };
  }

  if (diffDays === 1) {
    return {
      label: '1 day remaining',
      isUrgent: true,
      isExpired: false,
      rawDateFormatted
    };
  }

  return {
    label: `${diffDays} days remaining`,
    isUrgent: diffDays <= 7,
    isExpired: false,
    rawDateFormatted
  };
}

export function formatDateShort(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
