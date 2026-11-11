import {
	animate,
	motion,
	useMotionValue,
	useReducedMotion,
	type PanInfo,
} from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

type Slide = {
	left: string;
	midTop: string;
	midBottom: string;
	right: string;
};

const slides: Slide[] = [
	{
		left: '/images/home/gallery/57-sconce.jpg',
		midTop: '/images/home/gallery/52-arch.jpg',
		midBottom: '/images/home/gallery/40-facade.jpg',
		right: '/images/home/gallery/37-chandelier.jpg',
	},
	{
		left: '/images/home/gallery/60-cactus.jpg',
		midTop: '/images/home/gallery/50-pergola.jpg',
		midBottom: '/images/home/gallery/51-pergola.jpg',
		right: '/images/home/gallery/07-door.jpg',
	},
	{
		left: '/images/home/gallery/43-cypress.jpg',
		midTop: '/images/home/gallery/46-grove.jpg',
		midBottom: '/images/home/gallery/49-orchard.jpg',
		right: '/images/home/gallery/08-vault.jpg',
	},
	{
		left: '/images/home/gallery/57-sconce.jpg',
		midTop: '/images/home/gallery/66-building.jpg',
		midBottom: '/images/home/gallery/47-garden.jpg',
		right: '/images/home/gallery/37-chandelier.jpg',
	},
];

function mod(n: number, m: number) {
	return ((n % m) + m) % m;
}

export default function GallerySlider() {
	const shouldReduce = useReducedMotion();
	const viewportRef = useRef<HTMLDivElement>(null);
	const [index, setIndex] = useState(0);
	const [width, setWidth] = useState(0);
	const [ready, setReady] = useState(false);
	const x = useMotionValue(0);
	const animating = useRef(false);
	const indexRef = useRef(index);
	indexRef.current = index;

	const measure = useCallback(
		(reposition = false) => {
			const viewport = viewportRef.current;
			if (!viewport) return;
			const nextWidth = viewport.getBoundingClientRect().width;
			setWidth(nextWidth);
			if (reposition) x.set(-indexRef.current * nextWidth);
			setReady(true);
		},
		[x],
	);

	useLayoutEffect(() => {
		measure(true);
	}, [measure]);

	useEffect(() => {
		const onResize = () => measure(true);
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [measure]);

	const goTo = useCallback(
		(next: number) => {
			if (!width) return;
			const targetIndex = mod(next, slides.length);
			const target = -targetIndex * width;
			setIndex(targetIndex);

			if (shouldReduce) {
				x.set(target);
				animating.current = false;
				return;
			}

			animating.current = true;
			animate(x, target, {
				type: 'spring',
				stiffness: 180,
				damping: 28,
				mass: 0.75,
				onComplete: () => {
					animating.current = false;
				},
			});
		},
		[shouldReduce, width, x],
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
		const threshold = Math.min(110, width * 0.18);

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

	return (
		<div className="gallery-slider" aria-roledescription="carousel" aria-label="Gallery">
			<div className="gallery-slider__stage">
				<button
					type="button"
					className="gallery-slider__nav gallery-slider__nav--prev"
					aria-label="Slide precedente"
					onClick={() => stepBy(-1)}
				>
					←
				</button>

				<div ref={viewportRef} className="gallery-slider__viewport">
					<motion.div
						className="gallery-slider__track"
						style={{ x, opacity: ready ? 1 : 0 }}
						drag={shouldReduce || !width ? false : 'x'}
						dragConstraints={{ left: -99999, right: 99999 }}
						dragElastic={0.14}
						dragMomentum={false}
						onDragEnd={onDragEnd}
					>
						{slides.map((slide, i) => (
							<div
								key={i}
								className="gallery-slider__slide"
								style={{ width: width || '100%' }}
								aria-hidden={i !== index}
							>
								<div className="gallery-slider__grid">
									<img
										className="gallery-slider__cell gallery-slider__cell--tall"
										src={slide.left}
										alt=""
										width={529}
										height={721}
										draggable={false}
									/>
									<div className="gallery-slider__stack">
										<img
											className="gallery-slider__cell"
											src={slide.midTop}
											alt=""
											width={395}
											height={377}
											draggable={false}
										/>
										<img
											className="gallery-slider__cell"
											src={slide.midBottom}
											alt=""
											width={395}
											height={316}
											draggable={false}
										/>
									</div>
									<img
										className="gallery-slider__cell gallery-slider__cell--tall"
										src={slide.right}
										alt=""
										width={476}
										height={721}
										draggable={false}
									/>
								</div>
							</div>
						))}
					</motion.div>
				</div>

				<button
					type="button"
					className="gallery-slider__nav gallery-slider__nav--next"
					aria-label="Slide successiva"
					onClick={() => stepBy(1)}
				>
					→
				</button>
			</div>

			<div className="gallery-slider__dots" role="tablist" aria-label="Paginazione gallery">
				{slides.map((_, i) => (
					<button
						key={i}
						type="button"
						role="tab"
						aria-selected={i === index}
						aria-label={`Slide ${i + 1}`}
						className={`gallery-slider__dot${i === index ? ' is-active' : ''}`}
						onClick={() => goTo(i)}
					/>
				))}
			</div>
		</div>
	);
}
