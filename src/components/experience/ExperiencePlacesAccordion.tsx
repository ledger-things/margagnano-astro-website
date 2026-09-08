import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

export type PlaceItem = {
	slug: string;
	name: string;
	text: string;
	vedere: readonly string[];
	vivere: readonly string[];
	assaggiare: readonly string[];
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function ExperiencePlacesAccordion({ places }: { places: readonly PlaceItem[] }) {
	const [openSlug, setOpenSlug] = useState(places[0]?.slug ?? '');
	const shouldReduce = useReducedMotion();

	return (
		<div className="ex-places__list">
			{places.map((place) => {
				const isOpen = openSlug === place.slug;
				const panelId = `ex-places-panel-${place.slug}`;

				return (
					<div className={`ex-places__item${isOpen ? ' is-open' : ''}`} key={place.slug}>
						<button
							type="button"
							className="ex-places__trigger"
							aria-expanded={isOpen}
							aria-controls={panelId}
							onClick={() => setOpenSlug(place.slug)}
						>
							<span>{place.name}</span>
							<svg className="ex-places__chevron" viewBox="0 0 12 8" aria-hidden="true">
								<polyline
									points="1 1.5 6 6.5 11 1.5"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.15"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>

						<AnimatePresence initial={false}>
							{isOpen ? (
								<motion.div
									id={panelId}
									className="ex-places__panel-wrap"
									initial={shouldReduce ? false : { height: 0, opacity: 0 }}
									animate={{ height: 'auto', opacity: 1 }}
									exit={shouldReduce ? undefined : { height: 0, opacity: 0 }}
									transition={{
										height: { duration: shouldReduce ? 0 : 0.5, ease },
										opacity: { duration: shouldReduce ? 0 : 0.35, ease },
									}}
								>
									<div className="ex-places__panel">
										<p>{place.text}</p>
										<p>
											<strong>Da vedere:</strong> {place.vedere.join(' · ')}
										</p>
										<p>
											<strong>Da vivere:</strong> {place.vivere.join(' · ')}
										</p>
										<p>
											<strong>Da assaggiare:</strong> {place.assaggiare.join(' · ')}
										</p>
									</div>
								</motion.div>
							) : null}
						</AnimatePresence>
					</div>
				);
			})}
		</div>
	);
}
