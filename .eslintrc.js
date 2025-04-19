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
				'@typescript-eslint/prefer-nullish-coalescing': 'warn',
				'@typescript-eslint/no-empty-function': 'warn',
				'@typescript-eslint/no-unsafe-member-access': 'warn',
				'@typescript-eslint/no-unsafe-return': 'warn',
				'@typescript-eslint/no-unsafe-call': 'warn',
				'@typescript-eslint/no-non-null-assertion': 'warn',
				'@typescript-eslint/no-empty-interface': 'warn',
				'@typescript-eslint/no-useless-constructor': 'warn',
				'@typescript-eslint/unbound-method': 'warn',
				'no-await-in-loop': 'warn',
				'no-use-before-define': 'warn',
				camelcase: 'warn',
				'no-promise-executor-return': 'warn',
				radix: 'warn',
				'array-callback-return': 'warn'
			}
		}
	]
};
