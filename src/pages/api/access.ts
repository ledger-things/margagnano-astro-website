import type { APIRoute } from 'astro';
import {
	ACCESS_COOKIE,
	cookieOptions,
	createAccessToken,
	passwordMatches,
	safeRedirectPath,
} from '../../lib/access';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
	const contentType = request.headers.get('content-type') ?? '';
	let password = '';
	let next = '/home';

	if (contentType.includes('application/json')) {
		const body = (await request.json()) as { password?: string; redirect?: string };
		password = String(body.password ?? '');
		next = safeRedirectPath(body.redirect);
	} else {
		const form = await request.formData();
		password = String(form.get('password') ?? '');
		next = safeRedirectPath(String(form.get('redirect') ?? ''));
	}

	if (!passwordMatches(password)) {
		if (contentType.includes('application/json')) {
			return new Response(JSON.stringify({ ok: false, error: 'invalid' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		return redirect(`/access?error=1&redirect=${encodeURIComponent(next)}`);
	}

	cookies.set(ACCESS_COOKIE, await createAccessToken(), cookieOptions);

	if (contentType.includes('application/json')) {
		return new Response(JSON.stringify({ ok: true, redirect: next }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return redirect(next);
};
