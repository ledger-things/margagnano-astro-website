import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

type LifeTimelineRuleProps = {
	/** Allineamento orizzontale della linea nel track. */
	align?: 'start' | 'center' | 'end';
};

/**
 * Linea timeline: cresce dall’alto verso il basso in sync con lo scroll
 * mentre la riga attraversa il viewport.
 */
export default function LifeTimelineRule({ align = 'center' }: LifeTimelineRuleProps) {
	const trackRef = useRef<HTMLDivElement>(null);
	const shouldReduce = useReducedMotion();

	const { scrollYProgress } = useScroll({
		target: trackRef,
		// Parte quando il track entra dal basso, completa verso metà viewport
		offset: ['start 85%', 'end 45%'],
	});

	const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

	return (
		<div
			ref={trackRef}
			className={`lm-timeline lm-timeline--${align}`}
			aria-hidden="true"
		>
			<motion.span
				className="lm-timeline__line"
				style={
					shouldReduce
						? { scaleY: 1, transformOrigin: 'top center' }
						: { scaleY, transformOrigin: 'top center' }
				}
			/>
		</div>
	);
}
