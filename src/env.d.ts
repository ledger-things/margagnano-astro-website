/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly SITE_ACCESS_PASSWORD: string;
	readonly RESEND_API_KEY?: string;
	readonly ACCESS_REQUEST_TO?: string;
	readonly RESEND_FROM?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare namespace App {
	interface Locals {
		hasAccess: boolean;
		indexable: boolean;
	}
}
