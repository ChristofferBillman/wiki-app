import { PageTC } from '../models/Page'

const PageQuery = {
    pageById: PageTC.mongooseResolvers.findById(),
    pageByIds: PageTC.mongooseResolvers.findByIds(),
    pageOne: PageTC.mongooseResolvers.findOne(),
    pageMany: PageTC.mongooseResolvers.findMany(),
    pageCount: PageTC.mongooseResolvers.count(),
    pageConnection: PageTC.mongooseResolvers.connection(),
    pagePagination: PageTC.mongooseResolvers.pagination(),
}

const PageMutation = {
    pageCreateOne: PageTC.mongooseResolvers.createOne(),
    pageCreateMany: PageTC.mongooseResolvers.createMany(),
    pageUpdateById: PageTC.mongooseResolvers.updateById(),
    pageUpdateOne: PageTC.mongooseResolvers.updateOne(),
    pageUpdateMany: PageTC.mongooseResolvers.updateMany(),
    pageRemoveById: PageTC.mongooseResolvers.removeById(),
    pageRemoveOne: PageTC.mongooseResolvers.removeOne(),
    pageRemoveMany: PageTC.mongooseResolvers.removeMany(),
}

export { PageQuery, PageMutation }