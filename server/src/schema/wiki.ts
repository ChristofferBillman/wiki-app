import { IWiki, Wiki, WikiTC } from '../models/Wiki'
import { IUser, UserModel as User } from '../models/User'
import { PageModel as Page } from '../models/Page'
import Authorization from '../util/authorization'
import { removePassword } from './user'
import { PageRecord } from '../models/PageRecord'
import mongoose from 'mongoose'


interface WikiByNameArgs {
    name: string
}
const wikisByName = WikiTC.schemaComposer.createResolver<unknown, WikiByNameArgs>({
    name: 'wikiById',
    kind: 'query',
    args: {
        name: 'String!'
    },
    type: `type WikiPayload {
        wikis: [Wiki!]!
    }`,
    resolve: async ({ context, args }) => {
        Authorization.assertIsLoggedIn(context)
        const wikis = await Wiki.find({ _id: { $in: context.user.wikis }, name: args.name })
        return { wikis }
    }
})

const myWikis = WikiTC.schemaComposer.createResolver<unknown, {}>({
    name: 'myWikis',
    kind: 'query',
    type: `type WikiPayload {
        wikis: [Wiki!]!
    }`,
    resolve: async ({ context }) => {
        Authorization.assertIsLoggedIn(context)
        const wikis = await Wiki.find({ _id: { $in: context.user.wikis } })
        return { wikis }
    }
})

interface WikiByIdArgs {
    _id: string
}
const wikiById = WikiTC.schemaComposer.createResolver<unknown, WikiByIdArgs>({
    name: 'wikiById',
    kind: 'query',
    args: {
        _id: 'String!'
    },
    type: `type WikiPayload {
        wiki: Wiki
    }`,
    resolve: async ({ context, args }) => {
        Authorization.assertIsLoggedIn(context)
        const wiki = await Wiki.findById(args._id)
        return { wiki }
    }
})

interface CreateWikiArgs {
    description: string
    img: string
    name: string
    members: string[]
}
const createWiki = WikiTC.schemaComposer.createResolver<unknown, CreateWikiArgs>({
    name: 'createWiki',
    kind: 'mutation',
    args: {
        description: 'String!',
        img: 'String!',
        name: 'String!',
        members: '[String!]!'
    },
    type: `type WikiPayload {
        wiki: Wiki
    }`,
    resolve: async ({ args, context }) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        
        try {
            Authorization.assertIsLoggedIn(context)

            const { description, img, name, members } = args

            pushIfAbsent(members, context.user._id)

            const newWiki: IWiki = new Wiki({
                description,
                img,
                name,
                owner: context.user._id
            }, {session})

            const wiki: IWiki = await newWiki.save()

            await updateWikiMembers(members, wiki._id, {session})

            return { wiki }
        } catch(err) {
            await session.abortTransaction()
            session.endSession()
            throw err
        }
    }
})

interface UpdateWikiArgs {
    _id: string
    description: string
    img: string
    name: string
    owner: string
}
const updateWiki = WikiTC.schemaComposer.createResolver<unknown, UpdateWikiArgs>({
    name: 'updateWiki',
    kind: 'mutation',
    args: {
        _id: 'String!',
        description: 'String',
        img: 'String',
        name: 'String',
        owner: 'String'
    },
    type: `type WikiPayload {
        wiki: Wiki
    }`,
    resolve: async ({ args, context }) => {
        Authorization.assertIsLoggedIn(context)

        const { description, img, name, owner, _id } = args
        Authorization.assertIsWikiOwner(context, _id)

        const updatedWiki: IWiki | null = await Wiki.findByIdAndUpdate(
            _id,
            { description, img, name, owner },
            { new: true }
        )
        if (!updateWiki) throw new Error('No wiki with that ID was found.')

        return { wiki: updatedWiki }
    }
})

interface UpdateWikiMembersArgs {
    _id: string
    members: string[]
}
const updateWikiMembersResolver = WikiTC.schemaComposer.createResolver<unknown, UpdateWikiMembersArgs>({
    name: 'updateWiki',
    kind: 'mutation',
    args: {
        _id: 'String!',
        members: '[String]!'
    },
    type: `type WikiMembersPayload {
        members: [User]!
    }`,
    resolve: async ({ args, context }) => {
        Authorization.assertIsLoggedIn(context)
        Authorization.assertIsWikiOwner(context, args._id)

        const newMembersList = await updateWikiMembers(args.members, args._id)

        return { members: newMembersList }
    }
})

interface DeleteWikiArgs {
    _id: string
}
const removeWiki = WikiTC.schemaComposer.createResolver<unknown, DeleteWikiArgs>({
    name: 'removeWiki',
    kind: 'mutation',
    args: {
        _id: 'String!'
    },
    type: `type WikiPayload {
        wiki: Wiki
    }`,
    resolve: async ({ context, args }) => {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            Authorization.assertIsLoggedIn(context)
            Authorization.assertIsWikiOwner(context, args._id)

            const wiki = await Wiki.findByIdAndDelete(args._id, { session })

            await updateWikiMembers([], args._id, { session })

            const associatedPages = await Page.find({ wikiId: args._id }, null, { session })
            const associatedPagesIds = associatedPages.map(page => page._id)

            await Page.deleteMany({ _id: { $in: associatedPagesIds } }, { session })

            await PageRecord.deleteMany({ page: { $in: associatedPagesIds } }, { session })

            await session.commitTransaction()
            session.endSession()

            return { wiki }

        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            throw err
        }
    }
})

const WikiQuery = {
    wikisByName,
    myWikis,
    wikiById
}

const WikiMutation = {
    createWiki,
    updateWiki,
    updateWikiMembers: updateWikiMembersResolver,
    removeWiki,
}

export { WikiQuery, WikiMutation }

function pushIfAbsent(arr: unknown[], el: unknown) {
    if (!arr.includes(el)) {
        arr.push(el)
    }
}

async function updateWikiMembers(userIds, wikiId, session = null) {
    const oldMembersList = await User.find({ wikis: { $in: [wikiId] } }).session(session)

    const newMembersList = await User.find({ _id: { $in: userIds } }).session(session)

    const toBeRemoved = oldMembersList.filter(oldMember =>
        !newMembersList.some(newMember => newMember._id.toString() === oldMember._id.toString())
    )

    const toBeAdded = newMembersList.filter(newMember =>
        !oldMembersList.some(oldMember => oldMember._id.toString() === newMember._id.toString())
    )

    await User.updateMany(
        { _id: { $in: toBeRemoved.map(user => user._id) } },
        { $pull: { wikis: wikiId } },
        { session }
    )

    await User.updateMany(
        { _id: { $in: toBeAdded.map(user => user._id) } },
        { $addToSet: { wikis: wikiId } },
        { session }  // Include the session if provided
    )

    return newMembersList.map(member => {
        removePassword(member)
        return member
    })
}