import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

type TabId = 'tradizione' | 'territorio' | 'contemporaneita';

const tabs: {
	id: TabId;
	label: string;
	title: string;
	body: string;
	image: string;
	alt: string;
}[] = [
	{
		id: 'tradizione',
		label: 'Tradizione',
		title: 'Custodire la memoria',
		body: 'Margagnano affonda le proprie radici nella storia rurale della Puglia, conservando il carattere autentico delle antiche masserie. Ogni ambiente riflette il valore del tempo, della semplicità e del saper fare tramandato nel corso delle generazioni. La tradizione non viene esibita, ma custodita e reinterpretata con rispetto, affinché continui a vivere nel presente.',
		image: '/images/masseria/tabs.jpg',
		alt: 'Archi e cortile in pietra della masseria',
	},
	{
		id: 'territorio',
		label: 'Territorio',
		title: 'Il paesaggio intorno',
		body: 'Intorno a Margagnano si aprono uliveti, muri a secco e la luce della Valle d’Itria. Il territorio non è solo sfondo: entra nelle giornate, nei silenzi e nel modo in cui si vive la masseria, restituendo il ritmo autentico della Puglia.',
		image: '/images/masseria/tabs-territorio.jpg',
		alt: 'Giardino e canali in pietra della masseria',
	},
	{
		id: 'contemporaneita',
		label: 'Contemporaneità',
		title: 'Una nuova quiete',
		body: 'Accanto alla memoria, una cura contemporanea dell’ospitalità: comfort discreto, design essenziale e un’attenzione al dettaglio che lascia intatta l’anima del luogo, senza mai sovrastarla.',
		image: '/images/masseria/tabs-contemporanea.jpg',
		alt: 'Interno suite della masseria',
	},
];

export default function MasseriaTabs() {
	const [active, setActive] = useState(0);
	const shouldReduce = useReducedMotion();
	const current = tabs[active];

	const goNext = () => setActive((i) => (i + 1) % tabs.length);

	return (
		<section id="storia" className="mh-tabs" aria-labelledby="storia-title">
			<div className="mh-tabs__inner">
				<div className="mh-tabs__grid">
					<div className="mh-tabs__copy">
						<div className="mh-tabs__nav-block">
							<div className="mh-tabs__nav" role="tablist" aria-label="Storia della masseria">
								{tabs.map((tab, index) => {
									const selected = index === active;
									return (
										<span key={tab.id} className="mh-tabs__nav-item">
											{index > 0 ? (
												<span className="mh-tabs__sep" aria-hidden="true">
													|
												</span>
											) : null}
											<button
												type="button"
												role="tab"
												id={`tab-${tab.id}`}
												aria-selected={selected}
												aria-controls={`panel-${tab.id}`}
												tabIndex={selected ? 0 : -1}
												className={`mh-tabs__tab${selected ? ' is-active' : ''}`}
												onClick={() => setActive(index)}
											>
												{tab.label}
											</button>
										</span>
									);
								})}
							</div>

							<div className="mh-tabs__progress" aria-hidden="true">
								{tabs.map((tab, index) => (
									<span
										key={tab.id}
										className={`mh-tabs__progress-seg${index === active ? ' is-active' : ''}`}
									/>
								))}
							</div>
						</div>

						<div
							className="mh-tabs__panel"
							role="tabpanel"
							id={`panel-${current.id}`}
							aria-labelledby={`tab-${current.id}`}
						>
							<AnimatePresence mode="wait">
								<motion.div
									key={current.id}
									initial={shouldReduce ? false : { opacity: 0, y: 14 }}
									animate={{ opacity: 1, y: 0 }}
									exit={shouldReduce ? undefined : { opacity: 0, y: -10 }}
									transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
								>
									<h2 id="storia-title" className="mh-tabs__heading">
										{current.title}
									</h2>
									<p className="mh-tabs__text">{current.body}</p>
								</motion.div>
							</AnimatePresence>
						</div>

						<button
							type="button"
							className="mh-tabs__next"
							aria-label="Sezione successiva"
							onClick={goNext}
						>
							<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
								<path
									d="M5 12h12m0 0-5-5m5 5-5 5"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.35"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</div>

					<div className="mh-tabs__media">
						<AnimatePresence mode="wait">
							<motion.img
								key={current.image}
								src={current.image}
								alt={current.alt}
								width={1444}
								height={856}
								initial={shouldReduce ? false : { opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={shouldReduce ? undefined : { opacity: 0 }}
								transition={{ duration: 0.4 }}
							/>
						</AnimatePresence>
					</div>
				</div>
			</div>
		</section>
	);
}
