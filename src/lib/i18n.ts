export type Lang = 'it' | 'en';

export const LANG_STORAGE_KEY = 'margagnano-lang';
export const LANG_EVENT = 'margagnano:lang';

export function isLang(value: unknown): value is Lang {
	return value === 'it' || value === 'en';
}

export function readSiteLang(): Lang {
	if (typeof window === 'undefined') return 'it';
	try {
		const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
		if (isLang(stored)) return stored;
	} catch {
		// ignore
	}
	return document.documentElement.lang === 'en' ? 'en' : 'it';
}

export function applySiteLang(lang: Lang) {
	document.documentElement.lang = lang;
	try {
		window.localStorage.setItem(LANG_STORAGE_KEY, lang);
	} catch {
		// ignore
	}
	window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: { lang } }));
}
