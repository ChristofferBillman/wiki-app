export enum OperationType {
	QUERY,
	MUTATION,
	OTHER
}

export type AuthRules = {
	[key in 'admin' | 'user' | 'public']: AuthRule
}

export type AuthRule = {
	allowAll?: boolean
	query?: boolean | Predicate
	mutate?: boolean | Predicate
}

export type Predicate = (val: any) => boolean

export default class Authorization {
	/**
	 * 
	 * @param resolver Resolver to wrap
	 * @param authRules 
	 * @returns 
	 */
	static applyAuthRules = (resolver, authRules) => {
		return resolver.wrapResolve(next => rp => {

			// Get the user from context
			const user = rp.context.user
			// If user is not present in context, a non-user is making this request.
			const role = user ? user.role : 'public'

			// If allowAll rule is set, let the resolver continue.
			if (authRules[role].allowAll) {
				return next(rp)
			}
			
			// Determine if this resolver mutatates (edits, deletes) or queries (gets).
			const operationType = resolver.name.includes('find') || resolver.name.includes('get') ? OperationType.QUERY : (resolver.name.includes('update') || resolver.name.includes('edit') || resolver.name.includes('remove')) ? OperationType.MUTATION : OperationType.OTHER
			
			// If no error is thrown in checkPermissions, all conditions for mutating/querying this resource are met.
			checkPermissions(operationType, authRules[role], rp)

			// No error thrown, let resolver continue.
			return next(rp)
		})
	}

	/**
	 * Wraps an object of resolvers in authentication.   
	 * @param resolvers Take an object of resolvers.
	 * @param authRules 
	 */
	static bulkApplyAuthRules(resolvers: {[key: string]: any}, authRules) {
		Object.entries(resolvers).forEach(([key, resolver]) => {
			resolvers[key] = Authorization.applyAuthRules(resolver, authRules)
		})
	}
}

function checkPermissions(ot: OperationType, rules: AuthRules, rp) {

		const errString = `Forbidden: You are not allowed to ${ot == OperationType.QUERY ? 'access' : 'edit or remove'} this resource`

		const key = getKey(ot)
  		const rule = rules[key]
		
		if (isFunc(rule)) {
			if (!rule(rp)) throw new Error(errString)
		} else {
			if (!rule) throw new Error(errString)
		}

	function getKey(operationType: OperationType): keyof AuthRule {
		switch(operationType) {
			case OperationType.MUTATION: return 'mutate'
			case OperationType.QUERY: return 'query'
			case OperationType.OTHER: throw new Error('Invalid operation')
		}
	}

	function isFunc(obj: unknown) {
		return typeof obj === 'function'
	}
}