import antfu from '@antfu/eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import compiler from 'eslint-plugin-react-compiler';

export default antfu(
	{
		stylistic: false,
		react: {
			overrides: {
				'react-refresh/only-export-components': 'off',
				'react-dom/no-missing-button-type': 'off',
				'react/no-unstable-context-value': 'off',
			},
		},
		typescript: true,
		javascript: {
			overrides: {
				'no-console': 'off',
			},
		},
	},
	{
		name: 'react:compiler',
		files: ['**/*.[jt]sx?'],
		plugins: {
			'react-compiler': compiler,
		},
		rules: {
			'react-compiler/react-compiler': 'error',
		},
	},
	{
		name: 'style:prettier',
		plugins: {
			prettier: eslintPluginPrettier,
		},
		rules: {
			...eslintConfigPrettier.rules,
		},
	},
	{
		// https://perfectionist.dev/
		name: 'react:sorter',
		plugins: {
			perfectionist,
		},
	},
	{
		name: 'custom:rules',
		rules: {
			'eslint-comments/no-unlimited-disable': 'off',
			'prefer-promise-reject-errors': 'off',
			'react/no-array-index-key': 'off',
			'react-dom/no-flush-sync': 'off',
		},
	},
);
