import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import dayjs from 'dayjs';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig, loadEnv } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	return {
		plugins: [
			react({
				babel: {
					plugins: [['babel-plugin-react-compiler']],
				},
			}),
			AutoImport({
				imports: [
					'react',
					{
						clsx: ['clsx'],
					},
				],
			}),
			viteSingleFile(),
			{
				name: 'inject-build-time',
				apply: 'build',
				transformIndexHtml(html) {
					return {
						html,
						tags: [
							{
								tag: 'meta',
								attrs: {
									name: 'build-time',
									content: dayjs().format('YYYY-MM-DD HH:mm:ss'),
								},
								injectTo: 'head-prepend',
							},
						],
					};
				},
			},
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		server: {
			proxy: {
				'/admin': {
					target: env.VITE_BASE_URL,
					changeOrigin: true,
					secure: false,
				},
			},
		},
	};
});
