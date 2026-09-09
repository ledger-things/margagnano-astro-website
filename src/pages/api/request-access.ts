import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { confirmationEmail, logoAttachment, notificationEmail, type Lang } from '../../lib/email';

type RequestBody = {
	website?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	country?: string;
	visitTiming?: 'dates' | 'unknown';
	arrival?: string;
	departure?: string;
	guestType?: string;
	agencyName?: string;
	guestCount?: string;
	message?: string;
	privacy?: boolean;
	lang?: Lang;
};

function isEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isTransientSendError(error: { statusCode?: number | null; message?: string } | null) {
	if (!error) return false;
	return error.statusCode == null || /could not be resolved|fetch/i.test(error.message ?? '');
}

async function sendWithRetry(
	send: () => Promise<{ data: unknown; error: { statusCode?: number | null; message?: string } | null }>,
) {
	const first = await send();
	if (!first.error || !isTransientSendError(first.error)) {
		return first;
	}

	await new Promise((resolve) => setTimeout(resolve, 400));
	return send();
}

export const POST: APIRoute = async ({ request }) => {
	let body: RequestBody;

	try {
		body = (await request.json()) as RequestBody;
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (body.website) {
		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const firstName = String(body.firstName ?? '').trim();
	const lastName = String(body.lastName ?? '').trim();
	const email = String(body.email ?? '').trim();
	const country = String(body.country ?? '').trim();
	const visitTiming = body.visitTiming === 'dates' ? 'dates' : 'unknown';
	const arrival = String(body.arrival ?? '').trim();
	const departure = String(body.departure ?? '').trim();
	const guestType = String(body.guestType ?? '').trim();
	const agencyName = String(body.agencyName ?? '').trim();
	const guestCount = String(body.guestCount ?? '').trim();
	const message = String(body.message ?? '').trim();
	const lang: Lang = body.lang === 'en' ? 'en' : 'it';

	if (!firstName || !lastName || !isEmail(email) || !country || !guestType || body.privacy !== true) {
		return new Response(JSON.stringify({ ok: false, error: 'validation' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (visitTiming === 'dates' && (!arrival || !departure)) {
		return new Response(JSON.stringify({ ok: false, error: 'validation' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const apiKey = import.meta.env.RESEND_API_KEY;
	const to = import.meta.env.ACCESS_REQUEST_TO;
	const from =
		import.meta.env.RESEND_FROM || 'Masseria Margagnano <beth.t@example.com>';

	if (!apiKey || !to) {
		console.warn('Access request received but email is not configured.', {
			firstName,
			lastName,
			email,
			country,
			visitTiming,
			arrival,
			departure,
			guestType,
			agencyName,
			guestCount,
		});
		return new Response(
			JSON.stringify({
				ok: false,
				error: 'email_unconfigured',
				message: 'Email service is not configured yet.',
			}),
			{
				status: 503,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	}

	const resend = new Resend(apiKey);
	const logo = logoAttachment();
	const confirmation = confirmationEmail(lang, firstName);
	const notification = notificationEmail(lang, {
		firstName,
		lastName,
		email,
		country,
		visitTiming,
		arrival,
		departure,
		guestType,
		agencyName,
		guestCount,
		message,
	});

	const [notify, confirm] = await Promise.all([
		sendWithRetry(() =>
			resend.emails.send({
				from,
				to,
				replyTo: email,
				subject: notification.subject,
				html: notification.html,
				attachments: [logo],
			}),
		),
		sendWithRetry(() =>
			resend.emails.send({
				from,
				to: email,
				subject: confirmation.subject,
				html: confirmation.html,
				attachments: [logo],
			}),
		),
	]);

	if (notify.error || confirm.error) {
		console.error({ notify: notify.error, confirm: confirm.error });
		return new Response(JSON.stringify({ ok: false, error: 'send_failed' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
};
