import { WikiTC } from '../models/Wiki'

const WikiQuery = {
    wikiById: WikiTC.mongooseResolvers.findById(),
    wikiByIds: WikiTC.mongooseResolvers.findByIds(),
    wikiOne: WikiTC.mongooseResolvers.findOne(),
    wikiMany: WikiTC.mongooseResolvers.findMany(),
    wikiCount: WikiTC.mongooseResolvers.count(),
    wikiConnection: WikiTC.mongooseResolvers.connection(),
    wikiPagination: WikiTC.mongooseResolvers.pagination(),
}

const WikiMutation = {
    wikiCreateOne: WikiTC.mongooseResolvers.createOne(),
    wikiCreateMany: WikiTC.mongooseResolvers.createMany(),
    wikiUpdateById: WikiTC.mongooseResolvers.updateById(),
    wikiUpdateOne: WikiTC.mongooseResolvers.updateOne(),
    wikiUpdateMany: WikiTC.mongooseResolvers.updateMany(),
    wikiRemoveById: WikiTC.mongooseResolvers.removeById(),
    wikiRemoveOne: WikiTC.mongooseResolvers.removeOne(),
    wikiRemoveMany: WikiTC.mongooseResolvers.removeMany(),
}

export { WikiQuery, WikiMutation }