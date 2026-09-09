import { useSyncExternalStore } from 'react';
import { LANG_EVENT, readSiteLang, type Lang } from './i18n';

function subscribe(onStoreChange: () => void) {
	window.addEventListener(LANG_EVENT, onStoreChange);
	return () => window.removeEventListener(LANG_EVENT, onStoreChange);
}

function getSnapshot(): Lang {
	return readSiteLang();
}

function getServerSnapshot(): Lang {
	return 'it';
}

export function useSiteLang(): Lang {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
