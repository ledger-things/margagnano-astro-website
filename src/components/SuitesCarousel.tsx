import {
	animate,
	motion,
	useMotionValue,
	useReducedMotion,
	useTransform,
	type MotionValue,
	type PanInfo,
} from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

type Suite = {
	name: string;
	desc: string;
	image: string;
};

const suites: Suite[] = [
	{
		name: 'Nome uno',
		desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
		image: '/images/home/suite-interior.png',
	},
	{
		name: 'Nome due',
		desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
		image: '/images/home/suite-interior.png',
	},
	{
		name: 'Nome tre',
		desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
		image: '/images/home/suite-interior.png',
	},
];

const REPEAT = 5;
const LOOP = Array.from({ length: suites.length * REPEAT }, (_, i) => ({
	...suites[i % suites.length],
	key: `${i}-${suites[i % suites.length].name}`,
	sourceIndex: i % suites.length,
}));

const START = suites.length * Math.floor(REPEAT / 2);

function mod(n: number, m: number) {
	return ((n % m) + m) % m;
}

function SuiteCard({
	suite,
	index,
	x,
	centerOffset,
	step,
	isActive,
	onSelect,
}: {
	suite: (typeof LOOP)[number];
	index: number;
	x: MotionValue<number>;
	centerOffset: MotionValue<number>;
	step: number;
	isActive: boolean;
	onSelect: () => void;
}) {
	// Distanza dal centro del viewport (0 = card centrale)
	const distance = useTransform([x, centerOffset], ([latestX, offset]) => {
		if (!step) return 1;
		return Math.abs((Number(latestX) - Number(offset)) / step + index);
	});

	const scale = useTransform(distance, [0, 0.5, 1, 1.5], [1, 0.88, 0.78, 0.7]);
	const opacity = useTransform(distance, [0, 0.65, 1.25], [1, 0.9, 0.68]);
	const y = useTransform(distance, [0, 1.2], [0, 14]);

	return (
		<motion.button
			type="button"
			className={`suites-carousel__card${isActive ? ' is-active' : ''}`}
			style={{ scale, opacity, y }}
			aria-current={isActive ? 'true' : undefined}
			aria-label={`${suite.name}${isActive ? ', selezionata' : ', vai alla suite'}`}
			onClick={onSelect}
		>
			<figure className="suites-carousel__figure">
				<img src={suite.image} alt="" width={1170} height={792} draggable={false} />
				<figcaption className="suites-carousel__caption">
					<p className="suites-carousel__name">{suite.name}</p>
					<p className="suites-carousel__desc">{suite.desc}</p>
				</figcaption>
			</figure>
		</motion.button>
	);
}

export default function SuitesCarousel() {
	const shouldReduce = useReducedMotion();
	const viewportRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const [index, setIndex] = useState(START);
	const [step, setStep] = useState(0);
	const [ready, setReady] = useState(false);
	const x = useMotionValue(0);
	const centerOffset = useMotionValue(0);
	const animating = useRef(false);
	const indexRef = useRef(index);
	indexRef.current = index;

	const measure = useCallback(
		(reposition = false) => {
			const viewport = viewportRef.current;
			const track = trackRef.current;
			if (!viewport || !track) return;

			const card = track.querySelector<HTMLElement>('.suites-carousel__card');
			if (!card) return;

			const styles = getComputedStyle(track);
			const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
			const cardWidth = card.getBoundingClientRect().width;
			const nextStep = cardWidth + gap;
			const viewportWidth = viewport.getBoundingClientRect().width;
			const offset = (viewportWidth - cardWidth) / 2;
			const target = -indexRef.current * nextStep + offset;

			centerOffset.set(offset);
			setStep(nextStep);
			if (reposition) x.set(target);
			setReady(true);
		},
		[centerOffset, x],
	);

	useLayoutEffect(() => {
		measure(true);
	}, [measure]);

	useEffect(() => {
		const onResize = () => measure(true);
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [measure]);

	const targetFor = useCallback(
		(at: number, nextStep = step) => {
			return -at * nextStep + centerOffset.get();
		},
		[centerOffset, step],
	);

	const goTo = useCallback(
		(next: number) => {
			if (!step) return;
			const target = targetFor(next);
			setIndex(next);

			if (shouldReduce) {
				x.set(target);
				animating.current = false;
				return;
			}

			animating.current = true;
			animate(x, target, {
				type: 'spring',
				stiffness: 170,
				damping: 26,
				mass: 0.8,
				onComplete: () => {
					animating.current = false;
					const normalized = START + mod(next, suites.length);
					if (normalized !== next) {
						x.set(targetFor(normalized));
						setIndex(normalized);
					}
				},
			});
		},
		[shouldReduce, step, targetFor, x],
	);

	const stepBy = useCallback(
		(dir: -1 | 1) => {
			if (animating.current) return;
			goTo(index + dir);
		},
		[goTo, index],
	);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft') stepBy(-1);
			if (event.key === 'ArrowRight') stepBy(1);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [stepBy]);

	const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		const velocity = info.velocity.x;
		const offset = info.offset.x;
		const threshold = Math.min(120, step * 0.22);

		if (offset < -threshold || velocity < -500) {
			stepBy(1);
			return;
		}
		if (offset > threshold || velocity > 500) {
			stepBy(-1);
			return;
		}
		goTo(index);
	};

	const activeSource = mod(index, suites.length);

	return (
		<div className="suites-carousel" aria-roledescription="carousel" aria-label="Le suites">
			<div ref={viewportRef} className="suites-carousel__viewport">
				<motion.div
					ref={trackRef}
					className="suites-carousel__track"
					style={{ x, opacity: ready ? 1 : 0 }}
					drag={shouldReduce ? false : 'x'}
					dragConstraints={{ left: -99999, right: 99999 }}
					dragElastic={0.12}
					dragMomentum={false}
					onDragEnd={onDragEnd}
				>
					{LOOP.map((suite, i) => (
						<SuiteCard
							key={suite.key}
							suite={suite}
							index={i}
							x={x}
							centerOffset={centerOffset}
							step={step || 1}
							isActive={i === index}
							onSelect={() => {
								if (i !== index) goTo(i);
							}}
						/>
					))}
				</motion.div>
			</div>

			<div className="suites-carousel__controls">
				<button
					type="button"
					className="suites-carousel__arrow"
					aria-label="Suite precedente"
					onClick={() => stepBy(-1)}
				>
					←
				</button>
				<div className="suites-carousel__dots" role="tablist" aria-label="Suite">
					{suites.map((suite, i) => (
						<button
							key={suite.name}
							type="button"
							role="tab"
							aria-selected={i === activeSource}
							aria-label={suite.name}
							className={`suites-carousel__dot${i === activeSource ? ' is-active' : ''}`}
							onClick={() => goTo(START + i)}
						/>
					))}
				</div>
				<button
					type="button"
					className="suites-carousel__arrow"
					aria-label="Suite successiva"
					onClick={() => stepBy(1)}
				>
					→
				</button>
			</div>
		</div>
	);
}
