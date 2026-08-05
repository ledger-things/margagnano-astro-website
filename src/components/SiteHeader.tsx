import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useState } from 'react';

type Lang = 'it' | 'en';

type SiteHeaderProps = {
	/** `light`: logo/nav scuri fin da subito (hero chiari). */
	tone?: 'auto' | 'light';
};

const leftLinks = [
	{ href: '/la-masseria', label: 'La masseria' },
	{ href: '/#suites', label: 'Suites' },
	{ href: '/#masseria', label: 'Cucina' },
	{ href: '/#experience', label: 'Experience' },
];

const rightLinks = [
	{ href: '/life-in-margagnano', label: 'Life in Margagnano' },
	{ href: '/#gallery', label: 'Press & Media' },
	{ href: '/#prefooter', label: 'Contatti' },
];

const allLinks = [...leftLinks, ...rightLinks];

function readInitialLang(): Lang {
	if (typeof window === 'undefined') return 'it';
	const stored = window.localStorage.getItem('margagnano-lang');
	if (stored === 'it' || stored === 'en') return stored;
	return document.documentElement.lang === 'en' ? 'en' : 'it';
}

export default function SiteHeader({ tone = 'auto' }: SiteHeaderProps) {
	const [scrolled, setScrolled] = useState(tone === 'light');
	const [menuOpen, setMenuOpen] = useState(false);
	const [lang, setLang] = useState<Lang>('it');
	const shouldReduce = useReducedMotion();
	const menuId = useId();

	useEffect(() => {
		setLang(readInitialLang());
	}, []);

	useEffect(() => {
		if (tone === 'light') {
			setScrolled(true);
			return;
		}

		const onScroll = () => {
			setScrolled(window.scrollY > 72);
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, [tone]);

	useEffect(() => {
		if (!menuOpen) return;

		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setMenuOpen(false);
		};
		window.addEventListener('keydown', onKey);

		return () => {
			document.body.style.overflow = prev;
			window.removeEventListener('keydown', onKey);
		};
	}, [menuOpen]);

	useEffect(() => {
		const mq = window.matchMedia('(min-width: 961px)');
		const onChange = () => {
			if (mq.matches) setMenuOpen(false);
		};
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	}, []);

	const setLanguage = (next: Lang) => {
		setLang(next);
		document.documentElement.lang = next;
		window.localStorage.setItem('margagnano-lang', next);
		window.dispatchEvent(new CustomEvent('margagnano:lang', { detail: { lang: next } }));
	};

	const closeMenu = () => setMenuOpen(false);

	const langSwitch = (
		<div className="site-header__lang" role="group" aria-label="Lingua">
			<button
				type="button"
				className={`site-header__lang-btn${lang === 'it' ? ' is-active' : ''}`}
				aria-pressed={lang === 'it'}
				onClick={() => setLanguage('it')}
			>
				IT
			</button>
			<span className="site-header__lang-sep" aria-hidden="true">
				/
			</span>
			<button
				type="button"
				className={`site-header__lang-btn${lang === 'en' ? ' is-active' : ''}`}
				aria-pressed={lang === 'en'}
				onClick={() => setLanguage('en')}
			>
				EN
			</button>
		</div>
	);

	return (
		<header
			className={`site-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu-open' : ''}`}
		>
			<nav className="site-header__nav" aria-label="Navigazione principale">
				<div className="site-header__side site-header__side--left">
					<ul className="site-header__links">
						{leftLinks.map((link) => (
							<li key={link.label}>
								<a href={link.href}>{link.label}</a>
							</li>
						))}
					</ul>
				</div>

				<a className="site-header__brand" href="/" aria-label="Masseria Margagnano - Home">
					<img
						src="/images/logo-margagnano-white.png"
						alt=""
						className="site-header__logo site-header__logo--light"
						width="1024"
						height="724"
					/>
					<img
						src="/logo/logo-full-color.svg"
						alt=""
						className="site-header__logo site-header__logo--dark"
						width="842"
						height="595"
					/>
				</a>

				<div className="site-header__side site-header__side--right">
					<ul className="site-header__links">
						{rightLinks.map((link) => (
							<li key={link.label}>
								<a href={link.href}>{link.label}</a>
							</li>
						))}
						<li className="site-header__lang-item">{langSwitch}</li>
					</ul>
				</div>

				<button
					type="button"
					className="site-header__toggle"
					aria-expanded={menuOpen}
					aria-controls={menuId}
					aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
					onClick={() => setMenuOpen((open) => !open)}
				>
					<span className="site-header__toggle-lines" aria-hidden="true">
						<span />
						<span />
						<span />
					</span>
				</button>
			</nav>

			<AnimatePresence>
				{menuOpen ? (
					<motion.div
						id={menuId}
						className="site-header__drawer"
						role="dialog"
						aria-modal="true"
						aria-label="Menu di navigazione"
						initial={shouldReduce ? { opacity: 1 } : { opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={shouldReduce ? { opacity: 1 } : { opacity: 0 }}
						transition={{ duration: 0.25 }}
					>
						<motion.div
							className="site-header__drawer-panel"
							initial={shouldReduce ? false : { x: '100%' }}
							animate={{ x: 0 }}
							exit={shouldReduce ? undefined : { x: '100%' }}
							transition={{ type: 'spring', stiffness: 280, damping: 32 }}
						>
							<ul className="site-header__drawer-links">
								{allLinks.map((link, i) => (
									<motion.li
										key={link.label}
										initial={shouldReduce ? false : { opacity: 0, x: 24 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.05 + i * 0.04, duration: 0.35 }}
									>
										<a href={link.href} onClick={closeMenu}>
											{link.label}
										</a>
									</motion.li>
								))}
							</ul>
							<div className="site-header__drawer-lang">{langSwitch}</div>
						</motion.div>

						<button
							type="button"
							className="site-header__drawer-backdrop"
							aria-label="Chiudi menu"
							onClick={closeMenu}
						/>
					</motion.div>
				) : null}
			</AnimatePresence>
		</header>
	);
}
