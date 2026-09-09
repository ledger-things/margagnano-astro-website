import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useState } from 'react';
import { applySiteLang, type Lang } from '../lib/i18n';
import { useSiteLang } from '../lib/useSiteLang';

type PublicHeaderProps = {
	tone?: 'auto' | 'light';
	currentPath?: string;
	hasAccess?: boolean;
};

function normalizePath(pathname: string) {
	if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
	return pathname || '/';
}

function isActiveHref(href: string, pathname: string) {
	const path = normalizePath(pathname);
	if (href === '/') return path === '/';
	return path === href || path.startsWith(`${href}/`);
}

const navLinks = [
	{ href: '/philosophy', label: { it: 'Masseria & Filosofia', en: 'Masseria & Philosophy' } },
	{ href: '/life', label: { it: 'Life in Margagnano', en: 'Life in Margagnano' } },
];

export default function PublicHeader({
	tone = 'auto',
	currentPath = '/',
	hasAccess = false,
}: PublicHeaderProps) {
	const [scrolled, setScrolled] = useState(tone === 'light');
	const [menuOpen, setMenuOpen] = useState(false);
	const lang = useSiteLang();
	const shouldReduce = useReducedMotion();
	const menuId = useId();

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
		const mq = window.matchMedia('(min-width: 1101px)');
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

	const cta = hasAccess
		? {
				href: '/home',
				label: lang === 'it' ? 'Entra nella collezione' : 'Enter the collection',
			}
		: {
				href: '/request-access',
				label: lang === 'it' ? 'Scopri la private collection' : 'Discover the private collection',
			};

	const langSwitch = (
		<div className="public-header__lang" role="group" aria-label={lang === 'it' ? 'Lingua' : 'Language'}>
			<button
				type="button"
				className={`public-header__lang-btn${lang === 'it' ? ' is-active' : ''}`}
				aria-pressed={lang === 'it'}
				onClick={() => setLanguage('it')}
			>
				IT
			</button>
			<span className="public-header__lang-sep" aria-hidden="true">
				/
			</span>
			<button
				type="button"
				className={`public-header__lang-btn${lang === 'en' ? ' is-active' : ''}`}
				aria-pressed={lang === 'en'}
				onClick={() => setLanguage('en')}
			>
				EN
			</button>
		</div>
	);

	return (
		<header
			className={`public-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu-open' : ''}`}
		>
			<nav className="public-header__nav" aria-label={lang === 'it' ? 'Navigazione principale' : 'Main navigation'}>
				<a className="public-header__brand" href="/" aria-label="Masseria Margagnano - Home">
					<img
						src="/images/logo-margagnano-white.png"
						alt=""
						className="public-header__logo public-header__logo--light"
						width="1024"
						height="724"
					/>
					<img
						src="/logo/logo-full-color.svg"
						alt=""
						className="public-header__logo public-header__logo--dark"
						width="842"
						height="595"
					/>
				</a>

				<div className="public-header__cluster">
					<ul className="public-header__links">
						{navLinks.map((link) => {
							const active = isActiveHref(link.href, currentPath);
							return (
								<li key={link.href}>
									<a
										href={link.href}
										className={active ? 'is-active' : undefined}
										aria-current={active ? 'page' : undefined}
									>
										{link.label[lang]}
									</a>
								</li>
							);
						})}
					</ul>
					<a className="public-header__cta" href={cta.href}>
						{cta.label}
					</a>
					{langSwitch}
				</div>

				<button
					type="button"
					className="public-header__toggle"
					aria-expanded={menuOpen}
					aria-controls={menuId}
					aria-label={menuOpen ? (lang === 'it' ? 'Chiudi menu' : 'Close menu') : lang === 'it' ? 'Apri menu' : 'Open menu'}
					onClick={() => setMenuOpen((open) => !open)}
				>
					<span className="public-header__toggle-lines" aria-hidden="true">
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
						className="public-header__drawer"
						role="dialog"
						aria-modal="true"
						aria-label={lang === 'it' ? 'Menu di navigazione' : 'Navigation menu'}
						initial={shouldReduce ? { opacity: 1 } : { opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={shouldReduce ? { opacity: 1 } : { opacity: 0 }}
						transition={{ duration: 0.25 }}
					>
						<motion.div
							className="public-header__drawer-panel"
							initial={shouldReduce ? false : { x: '100%' }}
							animate={{ x: 0 }}
							exit={shouldReduce ? undefined : { x: '100%' }}
							transition={{ type: 'spring', stiffness: 280, damping: 32 }}
						>
							<ul className="public-header__drawer-links">
								{navLinks.map((link, i) => {
									const active = isActiveHref(link.href, currentPath);
									return (
										<motion.li
											key={link.href}
											initial={shouldReduce ? false : { opacity: 0, x: 24 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.05 + i * 0.04, duration: 0.35 }}
										>
											<a
												href={link.href}
												onClick={closeMenu}
												className={active ? 'is-active' : undefined}
												aria-current={active ? 'page' : undefined}
											>
												{link.label[lang]}
											</a>
										</motion.li>
									);
								})}
								<motion.li
									initial={shouldReduce ? false : { opacity: 0, x: 24 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2, duration: 0.35 }}
								>
									<a className="public-header__cta public-header__cta--drawer" href={cta.href} onClick={closeMenu}>
										{cta.label}
									</a>
								</motion.li>
							</ul>
							<div className="public-header__drawer-lang">{langSwitch}</div>
						</motion.div>

						<button
							type="button"
							className="public-header__drawer-backdrop"
							aria-label={lang === 'it' ? 'Chiudi menu' : 'Close menu'}
							onClick={closeMenu}
						/>
					</motion.div>
				) : null}
			</AnimatePresence>
		</header>
	);
}
