import { Types } from 'mongoose'
import { PageRecordTC, PageRecord, IPageRecord } from '../models/PageRecord'
import { IPage, PageModel as Page } from '../models/Page'
import Authorization from '../util/authorization'

interface HistoryByIdArgs {
    pageId: string
}
const historyById = PageRecordTC.schemaComposer.createResolver<unknown, HistoryByIdArgs>({
    name: 'allPagesInWiki',
    kind: 'query',
    args: {
        pageId: 'String!'
    },
    type: `type HistoryByIdArgs {
        history: [PageRecord]!
    }`,
    resolve: async ({ context, args }) => {
        Authorization.assertIsLoggedIn(context)

        const page: IPage | null = await Page.findOne({ pageId: args.pageId })
        Authorization.assertIsWikiMember(context, page.wikiId)

        const history: IPageRecord[] = await PageRecord
            .find({'page._id': new Types.ObjectId(args.pageId)})
            .sort({time: 'desc'})

        return { history }
    }
})

interface PageRecordArgs {
    pageId: string
    revision: string
}
const pageRecordById = PageRecordTC.schemaComposer.createResolver<unknown, PageRecordArgs>({
    name: 'pageRecordById',
    kind: 'query',
    args: {
        pageId: 'String!',
        revision: 'String!'
    },
    type: `type PageRecordByIdArgs {
        PageRecord: PageRecord!
    }`,
    resolve: async ({ context, args }) => {
        Authorization.assertIsLoggedIn(context)
        Authorization.assertIsWikiMember(context, args.pageId)

        const pageRecord: any = await PageRecord.findOne({'page._id': new Types.ObjectId(args.pageId), versionNumber: args.revision})

        return { pageRecord }
    }
})

const PageRecordQuery = {
    historyById,
    pageRecordById
}

const PageRecordMutation = {}

export { PageRecordQuery, PageRecordMutation }