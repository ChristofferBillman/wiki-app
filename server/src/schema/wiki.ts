import { WikiTC } from '../models/Wiki'
import Authorization from '../util/authorization'

const rules = {
    admin: { allowAll: true },
    user: {
        query: true,
        mutate: (rp) => rp.context.user._id.toString() === rp.args.record._id.toString(),
    }
}

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

Authorization.bulkApplyAuthRules(WikiQuery, rules)
Authorization.bulkApplyAuthRules(WikiMutation, rules)

export { WikiQuery, WikiMutation }