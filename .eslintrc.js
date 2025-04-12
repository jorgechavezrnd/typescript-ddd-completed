module.exports = {
	extends: ['eslint-config-codely/typescript'],
	rules: {
		'no-console': 'warn'
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			parserOptions: {
				project: ['./tsconfig.json']
			},
			rules: {
				'@typescript-eslint/no-floating-promises': 'warn',
				'@typescript-eslint/no-misused-promises': 'warn',
				'@typescript-eslint/no-unsafe-assignment': 'warn',
				'@typescript-eslint/no-unsafe-argument': 'warn',
				'@typescript-eslint/ban-types': 'warn',
				'@typescript-eslint/no-unnecessary-condition': 'warn',
				'@typescript-eslint/member-ordering': 'warn',
				'@typescript-eslint/require-await': 'warn',
				'@typescript-eslint/restrict-template-expressions': 'warn',
				'@typescript-eslint/explicit-module-boundary-types': 'warn',
				'no-await-in-loop': 'warn'
			}
		}
	]
};
