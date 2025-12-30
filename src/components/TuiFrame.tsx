import { twMerge } from 'tailwind-merge';

interface TuiFrameProps {
  children: React.ReactNode;
  title?: string;
  isActive?: boolean;
  className?: string;
  titleClassName?: string;
}

export const TuiFrame: React.FC<TuiFrameProps> = ({
  children,
  title,
  isActive = false,
  className,
  titleClassName,
}) => {
  const frameClasses = twMerge(
    'border border-[--color-dim] flex flex-col transition-all duration-300 min-w-0 relative',
    isActive && 'border-[--color-primary] shadow-[0_0_15px_-4px_rgba(0,240,255,0.3)]',
    className
  );

  const legendClasses = twMerge(
    'ml-4 px-2 select-none text-[--color-dim] text-sm font-bold uppercase tracking-widest',
    isActive && 'text-[--color-primary] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]',
    titleClassName
  );

  return (
    <fieldset className={frameClasses}>
      {title && (
        <legend className={legendClasses}>
          {isActive ? `[ ${title} ]` : title}
        </legend>
      )}
      <div className="flex-1 overflow-hidden p-1 w-full h-full relative">
        {children}
      </div>
    </fieldset>
  );
};
