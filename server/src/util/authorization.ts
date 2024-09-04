export type Role = 'admin' | 'user' | 'public'
export type Predicate = (val: any) => boolean | Promise<boolean>
export type AuthRule = boolean | Predicate

export default class Authorization {
	static assertIsLoggedIn(context) {
		if(!context.user) {
			throw new Error('You are not logged in.')
		}
	}
}