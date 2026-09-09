import { useCallback, useEffect, useRef, useState } from 'react';
import { guestRooms, localizeRoom, roomCardMeta } from '../../data/rooms';
import { useSiteLang } from '../../lib/useSiteLang';

export default function RoomsCarousel() {
	const lang = useSiteLang();
	const cards = guestRooms.map((room) => roomCardMeta(localizeRoom(room, lang)));
	const viewportRef = useRef<HTMLDivElement>(null);
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(true);

	const update = useCallback(() => {
		const viewport = viewportRef.current;
		if (!viewport) return;
		const max = viewport.scrollWidth - viewport.clientWidth;
		setCanPrev(viewport.scrollLeft > 8);
		setCanNext(viewport.scrollLeft < max - 8);
	}, []);

	useEffect(() => {
		const viewport = viewportRef.current;
		if (!viewport) return;
		update();
		viewport.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update);
		return () => {
			viewport.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
		};
	}, [update]);

	const scrollByCard = (direction: -1 | 1) => {
		const viewport = viewportRef.current;
		const card = viewport?.querySelector<HTMLElement>('.rooms-carousel__card');
		if (!viewport || !card) return;
		const styles = getComputedStyle(viewport.querySelector('.rooms-carousel__track') ?? viewport);
		const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
		viewport.scrollBy({
			left: direction * (card.getBoundingClientRect().width + gap),
			behavior: 'smooth',
		});
	};

	return (
		<div className="rooms-carousel">
			<button
				type="button"
				className="rooms-carousel__arrow rooms-carousel__arrow--prev"
				aria-label={lang === 'it' ? 'Camere precedenti' : 'Previous rooms'}
				disabled={!canPrev}
				onClick={() => scrollByCard(-1)}
			>
				<span aria-hidden="true">←</span>
			</button>

			<div
				ref={viewportRef}
				className="rooms-carousel__viewport"
				aria-roledescription="carousel"
				aria-label={lang === 'it' ? 'Le camere' : 'The rooms'}
			>
				<div className="rooms-carousel__track">
					{cards.map((room) => (
						<article key={room.slug} className="rooms-carousel__card">
							<figure className="rooms-carousel__figure">
								<img
									src={room.highlightImage}
									alt=""
									width="720"
									height="900"
									loading="lazy"
								/>
							</figure>
							<h3 className="rooms-carousel__name">{room.name}</h3>
							<p className="rooms-carousel__meta">{room.meta}</p>
							<p className="rooms-carousel__excerpt">{room.excerpt}</p>
							<a className="rooms-carousel__cta" href={`/suites/${room.slug}`}>
								Discover <span aria-hidden="true">→</span>
							</a>
						</article>
					))}
				</div>
			</div>

			<button
				type="button"
				className="rooms-carousel__arrow rooms-carousel__arrow--next"
				aria-label={lang === 'it' ? 'Camere successive' : 'Next rooms'}
				disabled={!canNext}
				onClick={() => scrollByCard(1)}
			>
				<span aria-hidden="true">→</span>
			</button>
		</div>
	);
}
