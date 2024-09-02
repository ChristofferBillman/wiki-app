import { PageRecordTC } from '../models/PageRecord'

const PageRecordQuery = {
    PageRecordById: PageRecordTC.mongooseResolvers.findById(),
    PageRecordByIds: PageRecordTC.mongooseResolvers.findByIds(),
    PageRecordOne: PageRecordTC.mongooseResolvers.findOne(),
    PageRecordMany: PageRecordTC.mongooseResolvers.findMany(),
    PageRecordCount: PageRecordTC.mongooseResolvers.count(),
    PageRecordConnection: PageRecordTC.mongooseResolvers.connection(),
    PageRecordPagination: PageRecordTC.mongooseResolvers.pagination(),
}

const PageRecordMutation = {
    PageRecordCreateOne: PageRecordTC.mongooseResolvers.createOne(),
    PageRecordCreateMany: PageRecordTC.mongooseResolvers.createMany(),
    PageRecordUPdateById: PageRecordTC.mongooseResolvers.updateById(),
    PageRecordUPdateOne: PageRecordTC.mongooseResolvers.updateOne(),
    PageRecordUPdateMany: PageRecordTC.mongooseResolvers.updateMany(),
    PageRecordRemoveById: PageRecordTC.mongooseResolvers.removeById(),
    PageRecordRemoveOne: PageRecordTC.mongooseResolvers.removeOne(),
    PageRecordRemoveMany: PageRecordTC.mongooseResolvers.removeMany(),
}

export { PageRecordQuery, PageRecordMutation }