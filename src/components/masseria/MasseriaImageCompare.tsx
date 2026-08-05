import { useCallback, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';

type Props = {
	beforeSrc?: string;
	afterSrc?: string;
	beforeAlt?: string;
	afterAlt?: string;
	initialPosition?: number;
};

function clamp(value: number, min = 0, max = 100) {
	return Math.min(max, Math.max(min, value));
}

export default function MasseriaImageCompare({
	beforeSrc = '/images/masseria/tabs.jpg',
	afterSrc = '/images/masseria/tabs-territorio.jpg',
	beforeAlt = 'Cortile in pietra con archi e fichi d’India',
	afterAlt = 'Percorso tra gli alberi verso la masseria',
	initialPosition = 50,
}: Props) {
	const [position, setPosition] = useState(() => clamp(initialPosition));
	const frameRef = useRef<HTMLDivElement>(null);
	const draggingRef = useRef(false);
	const labelId = useId();

	const updateFromClientX = useCallback((clientX: number) => {
		const frame = frameRef.current;
		if (!frame) return;
		const { left, width } = frame.getBoundingClientRect();
		if (width <= 0) return;
		setPosition(clamp(((clientX - left) / width) * 100));
	}, []);

	const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
		if (event.button !== 0 && event.pointerType === 'mouse') return;
		draggingRef.current = true;
		frameRef.current?.setPointerCapture(event.pointerId);
		updateFromClientX(event.clientX);
	};

	const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
		if (!draggingRef.current) return;
		updateFromClientX(event.clientX);
	};

	const endDrag = (event: PointerEvent<HTMLDivElement>) => {
		if (!draggingRef.current) return;
		draggingRef.current = false;
		if (frameRef.current?.hasPointerCapture(event.pointerId)) {
			frameRef.current.releasePointerCapture(event.pointerId);
		}
	};

	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const step = event.shiftKey ? 10 : 2;
		let next: number | null = null;

		switch (event.key) {
			case 'ArrowLeft':
			case 'ArrowDown':
				next = position - step;
				break;
			case 'ArrowRight':
			case 'ArrowUp':
				next = position + step;
				break;
			case 'Home':
				next = 0;
				break;
			case 'End':
				next = 100;
				break;
			default:
				return;
		}

		event.preventDefault();
		setPosition(clamp(next));
	};

	const rounded = Math.round(position);

	return (
		<div
			ref={frameRef}
			className="mh-compare__frame"
			style={{ '--mh-compare-pos': `${position}%` } as CSSProperties}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={endDrag}
			onPointerCancel={endDrag}
		>
			<img
				className="mh-compare__img mh-compare__img--after"
				src={afterSrc}
				alt={afterAlt}
				width={1600}
				height={1000}
				draggable={false}
				decoding="async"
				loading="lazy"
			/>
			<img
				className="mh-compare__img mh-compare__img--before"
				src={beforeSrc}
				alt={beforeAlt}
				width={1600}
				height={1000}
				draggable={false}
				decoding="async"
				loading="lazy"
			/>

			<div className="mh-compare__divider" aria-hidden="true">
				<span className="mh-compare__knob">
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
						<path d="M6 4.5 2.5 9 6 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
						<path d="M12 4.5 15.5 9 12 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</span>
			</div>

			<div
				className="mh-compare__slider"
				role="slider"
				tabIndex={0}
				aria-labelledby={labelId}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={rounded}
				aria-valuetext={`${rounded}%`}
				aria-orientation="horizontal"
				onKeyDown={onKeyDown}
			/>

			<span id={labelId} className="sr-only">
				Confronto immagini: scorri per confrontare cortile e territorio
			</span>
		</div>
	);
}
