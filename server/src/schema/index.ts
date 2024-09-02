import { SchemaComposer } from 'graphql-compose'

import { UserQuery, UserMutation } from './user'
import { PageRecordMutation, PageRecordQuery } from './pagerecord'
import { PageMutation, PageQuery } from './page'
import { WikiMutation, WikiQuery } from './wiki'

const schemaComposer = new SchemaComposer()

schemaComposer.Query.addFields({
    ...UserQuery,
    ...PageQuery,
    ...PageRecordQuery,
    ...WikiQuery,
})

schemaComposer.Mutation.addFields({
    ...UserMutation,
    ...PageMutation,
    ...PageRecordMutation,
    ...WikiMutation,
})

export default schemaComposer.buildSchema()