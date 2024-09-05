import { CodegenConfig } from '@graphql-codegen/cli'

const schemaUrl = process.env.GRAPHQL_SCHEMA_URL || 'http://localhost:3000/graphql'

const config: CodegenConfig = {
	schema: schemaUrl,
	documents: ['src/**/*.{ts,tsx}'],
	generates: {
		'./src/__generated__/': {
			preset: 'client',
			plugins: ['typescript'],
			presetConfig: {
				gqlTagName: 'gql',
			}
		},
	},
	ignoreNoDocuments: true,

}
export default config