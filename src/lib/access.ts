export const ACCESS_COOKIE = 'margagnano_access';
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 30;
export const MEMBERS_HOME = '/home';

const PUBLIC_PATHS = new Set([
	'/',
	'/philosophy',
	'/life',
	'/request-access',
	'/access',
	'/privacy-policy',
	'/robots.txt',
	'/favicon.ico',
	'/favicon.svg',
	'/site.webmanifest',
]);

const PUBLIC_PREFIXES = [
	'/api/access',
	'/api/request-access',
	'/_astro',
	'/_image',
	'/images/',
	'/logo/',
	'/fonts/',
	'/@',
	'/node_modules/',
	'/src/',
	'/@vite',
	'/@id',
	'/@fs',
];

const STATIC_FILE = /\.(?:png|jpe?g|svg|webp|gif|ico|woff2?|ttf|eot|css|js|map|webmanifest|txt|json)$/i;

export function normalizePath(pathname: string) {
	if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
	return pathname || '/';
}

export function isPublicPath(pathname: string) {
	const path = normalizePath(pathname);
	if (PUBLIC_PATHS.has(path)) return true;
	if (PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix))) return true;
	if (STATIC_FILE.test(path)) return true;
	return false;
}

export function isIndexablePath(pathname: string) {
	const path = normalizePath(pathname);
	if (path === '/access') return false;
	return isPublicPath(path) && !path.startsWith('/api/');
}

function getSecret() {
	return import.meta.env.SITE_ACCESS_PASSWORD ?? '';
}

function toHex(buffer: ArrayBuffer) {
	return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hmacHex(message: string) {
	const secret = getSecret();
	if (!secret) return '';
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign'],
	);
	const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
	return toHex(signature);
}

function timingSafeEqual(a: string, b: string) {
	const encoder = new TextEncoder();
	const bufA = encoder.encode(a);
	const bufB = encoder.encode(b);
	const len = Math.max(bufA.length, bufB.length);
	let diff = bufA.length === bufB.length ? 0 : 1;
	for (let i = 0; i < len; i++) {
		diff |= (bufA[i] ?? 0) ^ (bufB[i] ?? 0);
	}
	return diff === 0;
}

export async function createAccessToken() {
	return hmacHex('granted');
}

export async function isValidAccessToken(token: string | undefined) {
	if (!token || !getSecret()) return false;
	const expected = await createAccessToken();
	return expected.length > 0 && timingSafeEqual(token, expected);
}

export function passwordMatches(provided: string) {
	const expected = getSecret();
	if (!expected) return false;
	return timingSafeEqual(provided, expected);
}

export function safeRedirectPath(value: string | null | undefined) {
	if (!value) return MEMBERS_HOME;
	let decoded = value;
	try {
		decoded = decodeURIComponent(value);
	} catch {
		return MEMBERS_HOME;
	}
	if (!decoded.startsWith('/') || decoded.startsWith('//') || decoded.startsWith('/\\')) {
		return MEMBERS_HOME;
	}
	const pathOnly = normalizePath(decoded.split('?')[0] ?? decoded);
	if (isPublicPath(pathOnly)) return MEMBERS_HOME;
	return decoded;
}

export const cookieOptions = {
	httpOnly: true,
	secure: import.meta.env.PROD,
	sameSite: 'lax' as const,
	path: '/',
	maxAge: ACCESS_MAX_AGE,
};
