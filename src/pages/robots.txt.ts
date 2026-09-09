import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
	const body = `User-agent: *
Allow: /
Allow: /philosophy
Allow: /life
Allow: /request-access
Allow: /privacy-policy
Disallow: /home
Disallow: /masseria
Disallow: /suites
Disallow: /cuisine
Disallow: /experience
Disallow: /life-in-margagnano
Disallow: /access
Disallow: /api/
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};
