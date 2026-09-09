import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useSiteLang } from '../../lib/useSiteLang';

type TabId = 'tradizione' | 'territorio' | 'contemporaneita';

const tabs: {
	id: TabId;
	label: { it: string; en: string };
	title: { it: string; en: string };
	body: { it: string; en: string };
	image: string;
	alt: { it: string; en: string };
}[] = [
	{
		id: 'tradizione',
		label: { it: 'Tradizione', en: 'Tradition' },
		title: { it: 'Custodire la memoria', en: 'Keeping memory' },
		body: {
			it: 'Margagnano affonda le proprie radici nella storia rurale della Puglia, conservando il carattere autentico delle antiche masserie. Ogni ambiente riflette il valore del tempo, della semplicità e del saper fare tramandato nel corso delle generazioni. La tradizione non viene esibita, ma custodita e reinterpretata con rispetto, affinché continui a vivere nel presente.',
			en: 'Margagnano is rooted in the rural history of Puglia, keeping the authentic character of the old masserie. Every room reflects the value of time, of simplicity and of a craft handed down through generations. Tradition is not displayed: it is kept and quietly reinterpreted, so that it can still live in the present.',
		},
		image: '/images/masseria/tabs.jpg',
		alt: { it: 'Archi e cortile in pietra della masseria', en: 'Stone arches and courtyard of the masseria' },
	},
	{
		id: 'territorio',
		label: { it: 'Territorio', en: 'Landscape' },
		title: { it: 'Il paesaggio intorno', en: 'The landscape around' },
		body: {
			it: 'Intorno a Margagnano si aprono uliveti, muri a secco e la luce della Valle d’Itria. Il territorio non è solo sfondo: entra nelle giornate, nei silenzi e nel modo in cui si vive la masseria, restituendo il ritmo autentico della Puglia.',
			en: 'Around Margagnano open olive groves, dry-stone walls and the light of the Valle d’Itria. The land is not a backdrop: it enters the days, the silences and the way the masseria is lived, returning the true rhythm of Puglia.',
		},
		image: '/images/masseria/tabs-territorio.jpg',
		alt: { it: 'Giardino e canali in pietra della masseria', en: 'Garden and stone channels of the masseria' },
	},
	{
		id: 'contemporaneita',
		label: { it: 'Contemporaneità', en: 'The present' },
		title: { it: 'Una nuova quiete', en: 'A new quiet' },
		body: {
			it: 'Accanto alla memoria, una cura contemporanea dell’ospitalità: comfort discreto, design essenziale e un’attenzione al dettaglio che lascia intatta l’anima del luogo, senza mai sovrastarla.',
			en: 'Beside memory, a contemporary care for hospitality: discreet comfort, essential design and an attention to detail that leaves the soul of the place intact, never overwhelming it.',
		},
		image: '/images/masseria/tabs-contemporanea.jpg',
		alt: { it: 'Interno suite della masseria', en: 'Suite interior of the masseria' },
	},
];

export default function MasseriaTabs() {
	const [active, setActive] = useState(0);
	const shouldReduce = useReducedMotion();
	const lang = useSiteLang();
	const current = tabs[active];

	const goNext = () => setActive((i) => (i + 1) % tabs.length);

	return (
		<section id="storia" className="mh-tabs" aria-labelledby="storia-title">
			<div className="mh-tabs__inner">
				<div className="mh-tabs__grid">
					<div className="mh-tabs__copy">
						<div className="mh-tabs__nav-block">
							<div className="mh-tabs__nav" role="tablist" aria-label={lang === 'it' ? 'Storia della masseria' : 'History of the masseria'}>
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
												{tab.label[lang]}
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
										{current.title[lang]}
									</h2>
									<p className="mh-tabs__text">{current.body[lang]}</p>
								</motion.div>
							</AnimatePresence>
						</div>

						<button
							type="button"
							className="mh-tabs__next"
							aria-label={lang === 'it' ? 'Sezione successiva' : 'Next section'}
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
								alt={current.alt[lang]}
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
