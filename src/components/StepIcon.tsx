import type { HowItWorksIconKey } from '@/lib/howItWorks';

interface StepIconProps {
  icon: HowItWorksIconKey;
}

export function StepIcon({ icon }: StepIconProps) {
  const common = 'h-6 w-6 stroke-current text-primary';

  switch (icon) {
    case 'search':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <line
            x1="15"
            y1="15"
            x2="20"
            y2="20"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'tools':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M9 3a4 4 0 0 0 4 4l1.2-.4 1.8 1.8-3.6 3.6-1.8-1.8L9.4 9A4 4 0 0 0 9 3Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 13.5 6 20.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="6" cy="20.5" r="1.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case 'ship':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 15.5 5 9h14l2 6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 15.5h16v2.5c-1.2.7-2.1 1-3 1s-1.8-.3-3-1c-1.2.7-2.1 1-3 1s-1.8-.3-3-1c-1.2.7-2.1 1-3 1s-1.8-.3-3-1V15.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'customs':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="4"
            y="4"
            width="16"
            height="14"
            rx="2"
            ry="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M8 9h8M8 13h5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'plates':
      return (
        <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3"
            y="8"
            width="18"
            height="8"
            rx="1.5"
            ry="1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <rect
            x="5"
            y="10"
            width="3"
            height="4"
            rx="0.6"
            ry="0.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <line
            x1="10"
            y1="12"
            x2="18"
            y2="12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

