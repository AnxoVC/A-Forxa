import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const ExerciseIcon: React.FC<{ exerciseId: string } & IconProps> = ({ exerciseId, size = 24, className = '' }) => {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className
  };

  switch (exerciseId) {
    case 'bench-press':
      return (
        <svg {...props}>
          <path d="M4 14h16M4 14v4M20 14v4M2 10h20M12 10v4M6 10v4M18 10v4" />
          <circle cx="12" cy="7" r="3" />
        </svg>
      );
    case 'squat':
      return (
        <svg {...props}>
          <path d="M7 21v-6l3-3 2 3v6M17 21v-6l-3-3-2 3v6M12 15V9M7 9h10M12 9l2-4" />
          <circle cx="14" cy="3" r="2" />
        </svg>
      );
    case 'deadlift':
      return (
        <svg {...props}>
          <path d="M8 21v-8l4-4 4 4v8M12 13V9M4 19h16M4 17h16" />
          <circle cx="15" cy="5" r="2" />
        </svg>
      );
    case 'pull-up':
      return (
        <svg {...props}>
          <path d="M2 5h20M7 5v6l5 5 5-5V5M12 16v5" />
          <circle cx="12" cy="10" r="2" />
        </svg>
      );
    case 'overhead-press':
      return (
        <svg {...props}>
          <path d="M12 11v10M8 21h8M7 7h10M12 7V3" />
          <circle cx="12" cy="9" r="2" />
        </svg>
      );
    case 'dumbbell-curl':
      return (
        <svg {...props}>
          <path d="M12 21V9M8 21h8M12 9l-4-4M12 9l4-4" />
          <circle cx="12" cy="5" r="2" />
        </svg>
      );
    case 'leg-press':
      return (
        <svg {...props}>
          <path d="M3 21l8-8 4 4 6-6M3 13l8 8" />
        </svg>
      );
    case 'lat-pulldown':
      return (
        <svg {...props}>
          <path d="M4 5h16M12 5v8M8 13l4 4 4-4" />
          <circle cx="12" cy="17" r="2" />
        </svg>
      );
    case 'running':
      return (
        <svg {...props}>
          <path d="M13 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM14 6l-3 4-4-1M11 10l3 4M14 14l-2 5M14 14l4-3" />
        </svg>
      );
    default:
      // Generic dumbbell icon
      return (
        <svg {...props}>
          <path d="M6 5v14M18 5v14M6 12h12M4 7h4M4 17h4M16 7h4M16 17h4" />
        </svg>
      );
  }
};
