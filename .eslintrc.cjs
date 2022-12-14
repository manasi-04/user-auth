module.exports = {
	env: {
		node: true,
		es2021: true,
		jest: true
	},
	extends: 'eslint:recommended',
	overrides: [
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	rules: {
		indent: [
			'error',
			'tab'
		],
		semi: [
			'error',
			'always'
		]
	}
};
