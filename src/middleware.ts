import { defineMiddleware } from 'astro:middleware';
import {
	ACCESS_COOKIE,
	isIndexablePath,
	isPublicPath,
	isValidAccessToken,
	normalizePath,
} from './lib/access';

export const onRequest = defineMiddleware(async (context, next) => {
	const path = normalizePath(context.url.pathname);
	const hasAccess = await isValidAccessToken(context.cookies.get(ACCESS_COOKIE)?.value);
	const publicPath = isPublicPath(path);
	const indexable = isIndexablePath(path);

	context.locals.hasAccess = hasAccess;
	context.locals.indexable = indexable;

	if (!publicPath && !hasAccess) {
		const redirect = encodeURIComponent(`${path}${context.url.search}`);
		return context.redirect(`/access?redirect=${redirect}`);
	}

	const response = await next();

	if (!indexable) {
		response.headers.set('X-Robots-Tag', 'noindex, nofollow');
	}

	return response;
});
