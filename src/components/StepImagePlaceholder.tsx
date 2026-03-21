import Image from 'next/image';

interface StepImagePlaceholderProps {
  alt: string;
  className?: string;
  /** When set, show this image from `/public`; otherwise a neutral placeholder block */
  src?: string;
}

export function StepImagePlaceholder({ alt, className = '', src }: StepImagePlaceholderProps) {
  if (src) {
    return (
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-alt shadow ${className}`.trim()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 45vw, 448px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`aspect-[4/3] w-full rounded-xl bg-surface-alt shadow ${className}`.trim()}
      role="img"
      aria-label={alt}
    />
  );
}
