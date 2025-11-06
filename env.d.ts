/// <reference types="vite/client" />

import 'react';

declare module 'react' {
	interface CSSProperties {
		[key: `--${string}`]: string | number | undefined;
	}
}

interface ImportMetaEnv {
	readonly VITE_BASE_URL: string;
	readonly VITE_MOCK_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

global {
	interface Data {
		name: string;
		phone: string;
	}

	interface ApiResponse {
		success: boolean;
		records?: Data[];
		error?: { message: string };
	}
}
