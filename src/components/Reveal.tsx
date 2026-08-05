import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

type Tag = 'div' | 'span' | 'section';

interface RevealProps {
	children: ReactNode;
	/** Elemento wrapper da renderizzare (default: div). */
	as?: Tag;
	/** Ritardo prima dell'animazione, in secondi. */
	delay?: number;
	/** Durata dell'animazione, in secondi. */
	duration?: number;
	/** Spostamento verticale iniziale, in px. */
	y?: number;
	/** Spostamento orizzontale iniziale, in px. */
	x?: number;
	className?: string;
	/** Se true, anima quando entra nel viewport (scroll); altrimenti al mount. */
	inView?: boolean;
	/** Se true (default), l'animazione allo scroll parte una sola volta. */
	once?: boolean;
	/** Frazione dell'elemento visibile che innesca l'animazione allo scroll. */
	amount?: number;
}

export default function Reveal({
	children,
	as = 'div',
	delay = 0,
	duration = 0.9,
	y = 24,
	x = 0,
	className,
	inView = false,
	once = true,
	amount = 0.3,
}: RevealProps) {
	const shouldReduce = useReducedMotion();

	const MotionTag = motion[as] as React.ComponentType<HTMLMotionProps<'div'>>;

	const hidden = {
		opacity: 0,
		y: shouldReduce ? 0 : y,
		x: shouldReduce ? 0 : x,
	};
	const shown = { opacity: 1, y: 0, x: 0 };

	const transition = {
		duration: shouldReduce ? 0 : duration,
		delay: shouldReduce ? 0 : delay,
		ease: [0.22, 1, 0.36, 1] as const,
	};

	const animationProps: HTMLMotionProps<'div'> = inView
		? { whileInView: shown, viewport: { once, amount } }
		: { animate: shown };

	return (
		<MotionTag className={className} initial={hidden} transition={transition} {...animationProps}>
			{children}
		</MotionTag>
	);
}
