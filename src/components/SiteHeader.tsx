import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useState } from 'react';
import { applySiteLang, type Lang } from '../lib/i18n';
import { useSiteLang } from '../lib/useSiteLang';

type SiteHeaderProps = {
	/** `light`: logo/nav scuri fin da subito (hero chiari). */
	tone?: 'auto' | 'light';
	currentPath?: string;
	homeHref?: string;
};

function normalizePath(pathname: string) {
	if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
	return pathname;
}

function isActiveHref(href: string, pathname: string, hash: string) {
	const path = normalizePath(pathname);

	if (href.includes('#')) {
		const [hrefPath, hrefHash] = href.split('#');
		const targetPath = normalizePath(hrefPath || '/');
		const currentHash = hash.startsWith('#') ? hash.slice(1) : hash;
		return path === targetPath && currentHash === hrefHash;
	}

	return path === href || path.startsWith(`${href}/`);
}

const leftLinks = [
	{ href: '/masseria', label: { it: 'La masseria', en: 'The masseria' } },
	{ href: '/suites', label: { it: 'Suites', en: 'Suites' } },
	{ href: '/cuisine', label: { it: 'Cucina', en: 'Cuisine' } },
	{ href: '/experience', label: { it: 'Experience', en: 'Experience' } },
];

const rightLinks = [
	{ href: '/life-in-margagnano', label: { it: 'Life in Margagnano', en: 'Life in Margagnano' } },
	{ href: '/home#prefooter', label: { it: 'Contatti', en: 'Contacts' } },
];

const allLinks = [...leftLinks, ...rightLinks];

export default function SiteHeader({
	tone = 'auto',
	currentPath = '/',
	homeHref = '/home',
}: SiteHeaderProps) {
	const [scrolled, setScrolled] = useState(tone === 'light');
	const [menuOpen, setMenuOpen] = useState(false);
	const lang = useSiteLang();
	const [hash, setHash] = useState('');
	const shouldReduce = useReducedMotion();
	const menuId = useId();

	useEffect(() => {
		const syncHash = () => setHash(window.location.hash);
		syncHash();
		window.addEventListener('hashchange', syncHash);
		return () => window.removeEventListener('hashchange', syncHash);
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
		applySiteLang(next);
	};

	const closeMenu = () => setMenuOpen(false);

	const linkProps = (href: string) => {
		const active = isActiveHref(href, currentPath, hash);
		return {
			className: active ? 'is-active' : undefined,
			'aria-current': (active ? 'page' : undefined) as 'page' | undefined,
		};
	};

	const langSwitch = (
		<div className="site-header__lang" role="group" aria-label={lang === 'it' ? 'Lingua' : 'Language'}>
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
			<nav className="site-header__nav" aria-label={lang === 'it' ? 'Navigazione principale' : 'Main navigation'}>
				<div className="site-header__side site-header__side--left">
					<ul className="site-header__links">
						{leftLinks.map((link) => (
							<li key={link.href}>
								<a href={link.href} {...linkProps(link.href)}>
									{link.label[lang]}
								</a>
							</li>
						))}
					</ul>
				</div>

				<a className="site-header__brand" href={homeHref} aria-label="Masseria Margagnano - Home">
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
							<li key={link.href}>
								<a href={link.href} {...linkProps(link.href)}>
									{link.label[lang]}
								</a>
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
					aria-label={menuOpen ? (lang === 'it' ? 'Chiudi menu' : 'Close menu') : lang === 'it' ? 'Apri menu' : 'Open menu'}
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
						aria-label={lang === 'it' ? 'Menu di navigazione' : 'Navigation menu'}
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
										key={link.href}
										initial={shouldReduce ? false : { opacity: 0, x: 24 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.05 + i * 0.04, duration: 0.35 }}
									>
										<a href={link.href} onClick={closeMenu} {...linkProps(link.href)}>
											{link.label[lang]}
										</a>
									</motion.li>
								))}
							</ul>
							<div className="site-header__drawer-lang">{langSwitch}</div>
						</motion.div>

						<button
							type="button"
							className="site-header__drawer-backdrop"
							aria-label={lang === 'it' ? 'Chiudi menu' : 'Close menu'}
							onClick={closeMenu}
						/>
					</motion.div>
				) : null}
			</AnimatePresence>
		</header>
	);
}
