import fs from 'fs-extra'
import path from 'path'
import { graphql, GraphQLSchema } from 'graphql'
import { getIntrospectionQuery, printSchema } from 'graphql/utilities'

import Schema from '../schema'

async function buildSchema(): Promise<void> {
    await fs.ensureFile(path.join(__dirname, '../data/schema.graphql.json'))
    await fs.ensureFile(path.join(__dirname, '../data/schema.graphql'))

    const introspectionResult = await graphql({
        schema: Schema as GraphQLSchema,
        source: getIntrospectionQuery(),
    })

    fs.writeFileSync(
        path.join(__dirname, '../data/schema.graphql.json'),
        JSON.stringify(introspectionResult, null, 2)
    )

    fs.writeFileSync(
        path.join(__dirname, '../data/schema.graphql.txt'),
        printSchema(Schema as GraphQLSchema)
    )
}

async function run(): Promise<void> {
    try {
        await buildSchema()
        console.log('Schema build complete!')
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

run()