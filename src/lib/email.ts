import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export type Lang = 'it' | 'en';

const colors = {
	terracotta: '#994619',
	verde: '#7f8872',
	marrone: '#6b5a44',
	avorio: '#e9e3d3',
	cream: '#f9f6ee',
	ink: '#2c241c',
} as const;

const fonts = {
	title: "'Times New Roman', Times, Georgia, serif",
	body: "Georgia, 'Times New Roman', serif",
} as const;

const contacts = {
	name: 'Masseria Margagnano',
	address: 'Strada Comunale Burgo Cerasina',
	city: '72015 Fasano, Brindisi, Italy',
	email: 'info@masseriamargagnano.com',
} as const;

const tagline = {
	it: 'Dove il tempo rallenta',
	en: 'Where time slows down',
} as const;

export const LOGO_CID = 'margagnano-logo';

function readLogo() {
	const candidates = [
		fileURLToPath(new URL('../../public/images/logo-margagnano-white.png', import.meta.url)),
		join(process.cwd(), 'public/images/logo-margagnano-white.png'),
	];
	const path = candidates.find((candidate) => existsSync(candidate));
	if (!path) {
		throw new Error('Email logo not found.');
	}
	return readFileSync(path);
}

export function logoAttachment() {
	return {
		filename: 'logo-margagnano.png',
		content: readLogo().toString('base64'),
		contentId: LOGO_CID,
		contentType: 'image/png',
	};
}

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function row(label: string, value: string) {
	const trimmed = value.trim();
	if (!trimmed) return '';

	return `<tr>
		<td style="padding:12px 16px 12px 0;border-bottom:1px solid ${colors.avorio};color:${colors.marrone};width:42%;vertical-align:top;font-family:${fonts.body};font-size:15px;">${escapeHtml(label)}</td>
		<td style="padding:12px 0;border-bottom:1px solid ${colors.avorio};color:${colors.ink};vertical-align:top;font-family:${fonts.body};font-size:15px;">${escapeHtml(trimmed)}</td>
	</tr>`;
}

function wrapEmail(lang: Lang, title: string, preheader: string, inner: string) {
	const primary = tagline[lang];
	const secondary = lang === 'it' ? tagline.en : tagline.it;

	return `<!DOCTYPE html>
<html lang="${lang}" xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="color-scheme" content="light" />
	<meta name="supported-color-schemes" content="light" />
	<title>${escapeHtml(title)}</title>
	<style>
		:root { color-scheme: light; supported-color-schemes: light; }
	</style>
</head>
<body style="margin:0;padding:0;background:${colors.cream};">
	<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
	<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${colors.cream};">
		<tr>
			<td align="center" style="padding:32px 16px;">
				<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border:1px solid ${colors.avorio};">
					<tr>
						<td align="center" style="background:${colors.verde};padding:32px 28px 26px;">
							<img src="cid:${LOGO_CID}" alt="Masseria Margagnano" width="220" style="display:block;width:220px;max-width:72%;height:auto;border:0;" />
						</td>
					</tr>
					<tr>
						<td align="center" style="background:${colors.avorio};padding:20px 28px 18px;">
							<p style="margin:0;font-family:${fonts.body};font-style:italic;font-size:19px;line-height:1.45;color:${colors.terracotta};">${primary}</p>
							<p style="margin:8px 0 0;font-family:${fonts.title};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${colors.marrone};">${secondary}</p>
						</td>
					</tr>
					<tr>
						<td style="padding:36px 36px 32px;font-family:${fonts.body};color:${colors.ink};">
							${inner}
						</td>
					</tr>
					<tr>
						<td align="center" style="background:${colors.verde};padding:28px 24px;color:${colors.avorio};">
							<p style="margin:0 0 10px;font-family:${fonts.title};font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:${colors.avorio};">${contacts.name}</p>
							<p style="margin:0;font-family:${fonts.body};font-size:14px;line-height:1.7;color:${colors.avorio};">
								${contacts.address}<br />
								${contacts.city}<br />
								<a href="mailto:${contacts.email}" style="color:${colors.avorio};text-decoration:underline;">${contacts.email}</a>
							</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`;
}

export function confirmationEmail(lang: Lang, firstName: string) {
	const name = escapeHtml(firstName);

	if (lang === 'en') {
		const subject = 'We have received your request — Masseria Margagnano';
		return {
			subject,
			html: wrapEmail(
				'en',
				subject,
				'Thank you. We have received your request for the Private Collection.',
				`
					<h1 style="margin:0 0 20px;font-family:${fonts.title};font-weight:400;font-size:26px;line-height:1.2;letter-spacing:0.04em;text-transform:uppercase;color:${colors.terracotta};">Thank you for your request</h1>
					<p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:${colors.ink};">Dear ${name},</p>
					<p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:${colors.ink};">
						We have received your request for access to the Private Collection. Our team will review it personally and will be in touch shortly to accompany you in discovering Margagnano.
					</p>
					<p style="margin:0 0 24px;font-size:16px;line-height:1.75;color:${colors.ink};">
						Some places reveal themselves slowly. We look forward to continuing the conversation with you.
					</p>
					<p style="margin:0;font-size:16px;line-height:1.75;color:${colors.marrone};">With care,<br />Masseria Margagnano</p>
				`,
			),
		};
	}

	const subject = 'Abbiamo ricevuto la tua richiesta — Masseria Margagnano';
	return {
		subject,
		html: wrapEmail(
			'it',
			subject,
			'Grazie. Abbiamo ricevuto la tua richiesta di accesso alla Private Collection.',
			`
				<h1 style="margin:0 0 20px;font-family:${fonts.title};font-weight:400;font-size:26px;line-height:1.2;letter-spacing:0.04em;text-transform:uppercase;color:${colors.terracotta};">Grazie per la tua richiesta</h1>
				<p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:${colors.ink};">Gentile ${name},</p>
				<p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:${colors.ink};">
					Abbiamo ricevuto la tua richiesta di accesso alla Private Collection. Il nostro team la prenderà in considerazione personalmente e ti ricontatterà a breve per accompagnarti alla scoperta di Margagnano.
				</p>
				<p style="margin:0 0 24px;font-size:16px;line-height:1.75;color:${colors.ink};">
					Alcuni luoghi si rivelano con calma. Sarà un piacere continuare questa conversazione con te.
				</p>
				<p style="margin:0;font-size:16px;line-height:1.75;color:${colors.marrone};">Con cura,<br />Masseria Margagnano</p>
			`,
		),
	};
}

const guestTypeLabel: Record<Lang, Record<string, string>> = {
	it: {
		private: 'Ospite privato',
		advisor: 'Travel advisor / Agenzia',
		company: 'Azienda',
		other: 'Altro',
	},
	en: {
		private: 'Private guest',
		advisor: 'Travel advisor / Agency',
		company: 'Company',
		other: 'Other',
	},
};

export function notificationEmail(
	lang: Lang,
	fields: {
		firstName: string;
		lastName: string;
		email: string;
		country: string;
		visitTiming: 'dates' | 'unknown';
		arrival: string;
		departure: string;
		guestType: string;
		agencyName: string;
		guestCount: string;
		message: string;
	},
) {
	const labels =
		lang === 'en'
			? {
					title: 'Private collection request',
					firstName: 'First name',
					lastName: 'Last name',
					email: 'Email',
					country: 'Country',
					language: 'Language',
					visit: 'Stay',
					guestType: 'Guest type',
					agency: 'Agency / company',
					guests: 'Guests',
					message: 'Message',
					datesUnknown: 'Dates unknown',
				}
			: {
					title: 'Richiesta Private collection',
					firstName: 'Nome',
					lastName: 'Cognome',
					email: 'Email',
					country: 'Paese',
					language: 'Lingua',
					visit: 'Soggiorno',
					guestType: 'Tipo ospite',
					agency: 'Agenzia / azienda',
					guests: 'Ospiti',
					message: 'Messaggio',
					datesUnknown: 'Date da definire',
				};

	const visit =
		fields.visitTiming === 'dates' ? `${fields.arrival} → ${fields.departure}` : labels.datesUnknown;
	const type = guestTypeLabel[lang][fields.guestType] ?? fields.guestType;
	const subject = `${labels.title} — ${fields.firstName} ${fields.lastName}`;

	return {
		subject,
		html: wrapEmail(
			lang,
			subject,
			`${fields.firstName} ${fields.lastName} — ${fields.email}`,
			`
				<h1 style="margin:0 0 8px;font-family:${fonts.title};font-weight:400;font-size:22px;line-height:1.25;letter-spacing:0.06em;text-transform:uppercase;color:${colors.terracotta};">${labels.title}</h1>
				<p style="margin:0 0 22px;font-family:${fonts.body};font-size:14px;color:${colors.marrone};">${escapeHtml(fields.firstName)} ${escapeHtml(fields.lastName)}</p>
				<table role="presentation" cellpadding="0" cellspacing="0" width="100%">
					${row(labels.firstName, fields.firstName)}
					${row(labels.lastName, fields.lastName)}
					${row(labels.email, fields.email)}
					${row(labels.country, fields.country)}
					${row(labels.language, lang.toUpperCase())}
					${row(labels.visit, visit)}
					${row(labels.guestType, type)}
					${row(labels.agency, fields.agencyName)}
					${row(labels.guests, fields.guestCount)}
					${row(labels.message, fields.message)}
				</table>
			`,
		),
	};
}
