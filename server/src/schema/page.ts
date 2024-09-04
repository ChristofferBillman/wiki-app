import mongoose from 'mongoose'
import { PageTC, PageModel as Page, IPage } from '../models/Page'
import Authorization from '../util/authorization'
import { pushIfAbsent } from './wiki'
import { PageRecord } from '../models/PageRecord'


interface AllPagesInWikiArgs {
    _id: string
}
const allPagesInWiki = PageTC.schemaComposer.createResolver<unknown, AllPagesInWikiArgs>({
    name: 'allPagesInWiki',
    kind: 'query',
    args: {
        _id: 'String!'
    },
    type: `type PagesPayload {
        pages: [Page]!
    }`,
    resolve: async ({ context, args }) => {
        Authorization.assertIsLoggedIn(context)
        Authorization.assertIsWikiMember(context, args._id)

        const pages = await Page.find({wikiId: args._id})

        return { pages }
    }
})

interface PageByIdArgs {
    _id: string
}
const pageById = PageTC.schemaComposer.createResolver<unknown, PageByIdArgs>({
    name: 'pageById',
    kind: 'query',
    type: `type PagePayload {
        page: Page
    }`,
    resolve: async ({ context, args }) => {
        Authorization.assertIsLoggedIn(context)

        const page = await Page.findById(args._id)

        Authorization.assertIsWikiMember(context, page.wikiId)

        return { page }
    }
})

interface CreatePageArgs {
    content: string
    infoSection: any
    authors: string[],
    wikiId: string

}
const createPage = PageTC.schemaComposer.createResolver<unknown, CreatePageArgs>({
    name: 'createPage',
    kind: 'mutation',
    type: `type PagePayload {
        page: Page!
    }`,
    resolve: async ({ context, args }) => {
        const { content, infoSection, authors, wikiId } = args

        Authorization.assertIsLoggedIn(context)
        Authorization.assertIsWikiMember(context, wikiId)

        pushIfAbsent(authors, context.user._id)

        const page: IPage = new Page({
            content,
            infoSection,
            authors,
            wikiId
        })

        await page.save()

        return { page }
    }
})

interface UpdatePageArgs {
    _id: string
    content: string
    infoSection: any
    authors: string[],
    wikiId: string

}
const updatePage = PageTC.schemaComposer.createResolver<unknown, UpdatePageArgs>({
    name: 'updatePage',
    kind: 'mutation',
    type: `type PagePayload {
        page: Page!
    }`,
    resolve: async ({ context, args }) => {
        const { content, infoSection, authors, wikiId, _id } = args

        Authorization.assertIsLoggedIn(context)
        Authorization.assertIsWikiMember(context, wikiId)

        pushIfAbsent(authors, context.user._id)

        const page: IPage | null = await Page.findByIdAndUpdate(
            _id,
            { content, infoSection, authors },
            { new: true }
        )

        const numberOfRecords = await PageRecord.count({'page._id': new mongoose.Types.ObjectId(_id)})

        await new PageRecord({
            page,
            versionNumber: numberOfRecords,
            time: Date.now(),
            author: context.user._id
        }).save()


        return { page }
    }
})

interface RemovePageArgs {
    _id: string
}
const removePage = PageTC.schemaComposer.createResolver<unknown, RemovePageArgs>({
    name: 'removePage',
    kind: 'mutation',
    type: `type PagePayload {
        page: Page!
    }`,
    resolve: async ({ context, args }) => {
        Authorization.assertIsLoggedIn(context)

        const page: IPage = await Page.findById(args._id)

        Authorization.assertIsWikiMember(context, page.wikiId)

        const deletedPage: IPage | null = await Page.findByIdAndDelete(args._id)

        return { page: deletedPage }
    }
})



const PageQuery = {
    allPagesInWiki,
    pageById,
}

const PageMutation = {
    createPage,
    updatePage,
    removePage
}

export { PageQuery, PageMutation }