import { ObjectId } from "mongodb"
import { Wiki } from "../models/Wiki"

export type Role = 'admin' | 'user' | 'public'
export type Predicate = (val: any) => boolean | Promise<boolean>
export type AuthRule = boolean | Predicate

export default class Authorization {
	static assertIsLoggedIn(context) {
		if(!context.user) {
			throw new AuthorizationError('You are not logged in.')
		}
	}
	static async assertIsWikiOwner(context, wikiId) {
		const wiki = await Wiki.findById(wikiId)
		if(wiki.owner !== context.user._id.toString()) {
			throw new AuthorizationError(`Permissions: You cannot mutate a wiki you are not the owner of.`)
		}
	}
	static assertIsWikiMember(context, wikiId) {
		if(!context.user.wikis.includes(wikiId)) {
			throw new AuthorizationError(`Permissions: You cannot access a wiki you are not a member of.`)
		}
	}
	static AuthorizationErrorHandler(err, req, res, next) {
		if (err.name === 'AuthorizationError') {
			return res.status(400).send(err.message)
		}
		
		next(err)
	}
}

export class AuthorizationError extends Error {
	constructor(message) {
		super(message)
		this.name = 'AuthorizationError'
	}
}