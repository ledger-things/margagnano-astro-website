import { useState } from 'react';
import { countries } from '../data/countries';
import { useSiteLang } from '../lib/useSiteLang';

type GuestType = 'private' | 'advisor' | 'company' | 'other';
type VisitTiming = 'dates' | 'unknown';
type Status = 'idle' | 'submitting' | 'success' | 'error' | 'unconfigured';

const copy = {
	it: {
		title: 'Some places reveal themselves slowly.',
		intro1:
			'La prima impressione racconta solo una parte di Margagnano. La Private Collection permette di scoprirne più da vicino gli spazi, le suite, i dettagli e le esperienze che ne definiscono il carattere.',
		intro2:
			'Per accedere alla collezione privata, lasciaci alcune informazioni. Il nostro team prenderà personalmente in considerazione la tua richiesta e ti ricontatterà per accompagnarti alla scoperta di Margagnano.',
		firstName: 'Nome',
		lastName: 'Cognome',
		email: 'Email',
		country: 'Paese di residenza',
		countryPlaceholder: 'Seleziona il paese',
		visitSection: 'Il tuo soggiorno',
		visitLabel: 'Quando prevedi di visitare la Puglia?',
		specificDates: 'Ho date precise',
		unknownDates: 'Non lo so ancora',
		arrival: 'Arrivo',
		departure: 'Partenza',
		aboutYou: 'Su di te',
		describe: 'Come ti descriveresti?',
		privateGuest: 'Ospite privato',
		advisor: 'Travel advisor / Agenzia',
		company: 'Azienda',
		other: 'Altro',
		agency: 'Nome agenzia / azienda (se applicabile)',
		guestCount: 'Se applicabile, per quanti ospiti stai pianificando?',
		additional: 'Informazioni aggiuntive',
		message: 'Raccontaci qualsiasi cosa vorresti farci sapere.',
		privacy: 'Ho letto e accetto la',
		privacyLink: 'Privacy Policy',
		submit: 'Richiedi accesso alla Private Collection',
		submitting: 'Invio in corso…',
		success: 'Grazie. Abbiamo ricevuto la tua richiesta e ti ricontatteremo a breve.',
		error: 'Qualcosa non ha funzionato. Riprova tra poco.',
		unconfigured:
			'La richiesta è stata registrata in ambiente di sviluppo, ma l’invio email non è ancora configurato.',
		required: 'Campo obbligatorio',
	},
	en: {
		title: 'Some places reveal themselves slowly.',
		intro1:
			'The first impression tells only part of Margagnano. The Private Collection lets you discover more closely the spaces, suites, details and experiences that define its character.',
		intro2:
			'To access the private collection, leave us a few details. Our team will personally review your request and get back to you to accompany you in discovering Margagnano.',
		firstName: 'First name',
		lastName: 'Last name',
		email: 'Email address',
		country: 'Country of residence',
		countryPlaceholder: 'Select your country',
		visitSection: 'About your visit',
		visitLabel: 'When are you planning to visit Puglia?',
		specificDates: 'I have specific dates',
		unknownDates: "I don't know yet",
		arrival: 'Arrival',
		departure: 'Departure',
		aboutYou: 'About you',
		describe: 'How would you describe yourself?',
		privateGuest: 'Private guest',
		advisor: 'Travel advisor / Agency',
		company: 'Company',
		other: 'Other',
		agency: 'Agency / company name (if applicable)',
		guestCount: 'If applicable, how many guests are you planning for?',
		additional: 'Additional information',
		message: "Tell us anything you'd like us to know.",
		privacy: 'I have read and accept the',
		privacyLink: 'Privacy Policy',
		submit: 'Request access to the Private Collection',
		submitting: 'Sending…',
		success: 'Thank you. We have received your request and will be in touch shortly.',
		error: 'Something went wrong. Please try again shortly.',
		unconfigured:
			'Your request was captured in development, but email sending is not configured yet.',
		required: 'Required',
	},
} as const;

export default function AccessRequestForm() {
	const lang = useSiteLang();
	const [visitTiming, setVisitTiming] = useState<VisitTiming>('dates');
	const [guestType, setGuestType] = useState<GuestType>('private');
	const [status, setStatus] = useState<Status>('idle');
	const t = copy[lang];

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);

		setStatus('submitting');

		const payload = {
			website: String(data.get('website') ?? ''),
			firstName: String(data.get('firstName') ?? ''),
			lastName: String(data.get('lastName') ?? ''),
			email: String(data.get('email') ?? ''),
			country: String(data.get('country') ?? ''),
			visitTiming,
			arrival: String(data.get('arrival') ?? ''),
			departure: String(data.get('departure') ?? ''),
			guestType,
			agencyName: String(data.get('agencyName') ?? ''),
			guestCount: String(data.get('guestCount') ?? ''),
			message: String(data.get('message') ?? ''),
			privacy: data.get('privacy') === 'on',
			lang,
		};

		try {
			const response = await fetch('/api/request-access', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			const json = (await response.json()) as { ok?: boolean; error?: string };

			if (response.status === 503 && json.error === 'email_unconfigured') {
				setStatus('unconfigured');
				return;
			}

			if (!response.ok || !json.ok) {
				setStatus('error');
				return;
			}

			setStatus('success');
			form.reset();
			setVisitTiming('dates');
			setGuestType('private');
		} catch {
			setStatus('error');
		}
	};

	if (status === 'success') {
		return (
			<section id="access-form" className="access-form access-form--success" aria-labelledby="access-form-success">
				<p id="access-form-success" className="access-form__notice access-form__notice--success" role="status">
					{t.success}
				</p>
			</section>
		);
	}

	return (
		<section id="access-form" className="access-form" aria-labelledby="access-form-title">
			<div className="access-form__intro">
				<h2 id="access-form-title" className="access-form__title">
					{t.title}
				</h2>
				<p>{t.intro1}</p>
				<p>{t.intro2}</p>
			</div>

			{status === 'error' ? <p className="access-form__notice access-form__notice--error">{t.error}</p> : null}
			{status === 'unconfigured' ? (
				<p className="access-form__notice">{t.unconfigured}</p>
			) : null}

			<form className="access-form__form" onSubmit={onSubmit} noValidate={false}>
				<input type="text" name="website" className="access-form__honeypot" tabIndex={-1} autoComplete="off" />

				<div className="access-form__grid">
					<label className="access-form__field">
						<span>{t.firstName}</span>
						<input type="text" name="firstName" required autoComplete="given-name" />
					</label>
					<label className="access-form__field">
						<span>{t.lastName}</span>
						<input type="text" name="lastName" required autoComplete="family-name" />
					</label>
					<label className="access-form__field">
						<span>{t.email}</span>
						<input type="email" name="email" required autoComplete="email" />
					</label>
					<label className="access-form__field">
						<span>{t.country}</span>
						<select name="country" required defaultValue="">
							<option value="" disabled>
								{t.countryPlaceholder}
							</option>
							{countries.map((country) => (
								<option key={country} value={country}>
									{country}
								</option>
							))}
						</select>
					</label>
				</div>

				<div className="access-form__section">
					<p className="access-form__section-title">{t.visitSection}</p>
					<fieldset className="access-form__fieldset">
						<legend>{t.visitLabel}</legend>
						<label className="access-form__radio">
							<input
								type="radio"
								name="visitTiming"
								checked={visitTiming === 'dates'}
								onChange={() => setVisitTiming('dates')}
							/>
							<span>{t.specificDates}</span>
						</label>
						{visitTiming === 'dates' ? (
							<div className="access-form__dates">
								<label className="access-form__field">
									<span>{t.arrival}</span>
									<input type="date" name="arrival" required={visitTiming === 'dates'} />
								</label>
								<label className="access-form__field">
									<span>{t.departure}</span>
									<input type="date" name="departure" required={visitTiming === 'dates'} />
								</label>
							</div>
						) : null}
						<label className="access-form__radio">
							<input
								type="radio"
								name="visitTiming"
								checked={visitTiming === 'unknown'}
								onChange={() => setVisitTiming('unknown')}
							/>
							<span>{t.unknownDates}</span>
						</label>
					</fieldset>
				</div>

				<div className="access-form__section">
					<p className="access-form__section-title">{t.aboutYou}</p>
					<fieldset className="access-form__fieldset">
						<legend>{t.describe}</legend>
						<div className="access-form__pills">
							{(
								[
									['private', t.privateGuest],
									['advisor', t.advisor],
									['company', t.company],
									['other', t.other],
								] as const
							).map(([value, label]) => (
								<label key={value} className={`access-form__pill${guestType === value ? ' is-active' : ''}`}>
									<input
										type="radio"
										name="guestType"
										value={value}
										checked={guestType === value}
										onChange={() => setGuestType(value)}
									/>
									{label}
								</label>
							))}
						</div>
					</fieldset>
					<label className="access-form__field">
						<span>{t.agency}</span>
						<input type="text" name="agencyName" />
					</label>
					<label className="access-form__field">
						<span>{t.guestCount}</span>
						<input type="text" name="guestCount" inputMode="numeric" />
					</label>
				</div>

				<div className="access-form__section">
					<p className="access-form__section-title">{t.additional}</p>
					<label className="access-form__field">
						<span>{t.message}</span>
						<textarea name="message" rows={6} />
					</label>
				</div>

				<label className="access-form__privacy">
					<input type="checkbox" name="privacy" required />
					<span>
						{t.privacy} <a href="/privacy-policy">{t.privacyLink}</a>.
					</span>
				</label>

				<div className="access-form__actions">
					<button type="submit" className="access-form__submit" disabled={status === 'submitting'}>
						{status === 'submitting' ? t.submitting : t.submit}
					</button>
				</div>
			</form>
		</section>
	);
}
