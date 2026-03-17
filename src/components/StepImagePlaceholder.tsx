interface StepImagePlaceholderProps {
  alt: string;
  className?: string;
}

export function StepImagePlaceholder({ alt, className = '' }: StepImagePlaceholderProps) {
  return (
    <div
      className={`aspect-[4/3] w-full rounded-xl bg-surface-alt shadow ${className}`.trim()}
      role="img"
      aria-label={alt}
    />
  );
}
