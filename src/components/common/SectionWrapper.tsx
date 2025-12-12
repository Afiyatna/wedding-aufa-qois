import React, { ReactNode } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface SectionWrapperProps {
    id: string;
    isDark: boolean;
    backgroundImage?: string;
    children: (shouldAnimate: boolean) => ReactNode;
    className?: string;
    backgroundElement?: ReactNode;
}

// Helper component for granular element animations
interface AnimateInProps {
    children: ReactNode;
    from?: 'bottom' | 'top' | 'left' | 'right';
    delay?: number; // ms
    duration?: number; // ms
    shouldAnimate: boolean;
    className?: string;
}

export const AnimateIn: React.FC<AnimateInProps> = ({
    children,
    from = 'bottom',
    delay = 0,
    duration = 1000,
    shouldAnimate,
    className = ""
}) => {
    const getTransform = () => {
        switch (from) {
            case 'bottom': return 'translate-y-12';
            case 'top': return '-translate-y-12';
            case 'left': return '-translate-x-12';
            case 'right': return 'translate-x-12';
            default: return 'translate-y-12';
        }
    };

    return (
        <div
            className={`transition-all ease-out ${className} ${shouldAnimate ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${getTransform()}`
                }`}
            style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    );
};

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
    id,
    isDark,
    backgroundImage,
    children,
    className = "",
    backgroundElement,
}) => {
    const { ref, shouldAnimate } = useIntersectionObserver();

    return (
        <section
            id={id}
            ref={ref}
            className={`relative min-h-screen flex items-center py-12 sm:py-20 snap-start overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-rose-50 to-rose-100'
                } ${className}`}
        >
            {/* Animated Background Layer */}
            {backgroundImage && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* Main Background Image - Slow Zoom Effect */}
                    <div
                        className={`absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] ease-out ${shouldAnimate ? 'scale-110' : 'scale-100'
                            }`}
                        style={{
                            backgroundImage: `url('/images/background/${backgroundImage}.jpeg')`,
                        }}
                    />

                    {/* Overlay gradient for better text readability */}
                    <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'bg-black/60' : 'bg-white/30'
                        }`} />
                </div>
            )}

            {/* Custom Background Element */}
            {backgroundElement && (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {backgroundElement}
                </div>
            )}

            {/* Content Container - Use AnimateIn in children for granular control, but keep a base fade here or remove if fully granular */}
            <div className="relative z-20 w-full">
                {children(shouldAnimate)}
            </div>
        </section>
    );
};
