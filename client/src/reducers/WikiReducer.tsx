import Wiki from '../types/Wiki'

export interface WikiReducerAction {
	type: WikiReducerType,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payload: any
}

export enum WikiReducerType {
	SET_STATE,
	SET_FIELD,
}

export default function wikiReducer(state: Wiki, action: WikiReducerAction): Wiki {
	const { type, payload } = action

	switch (type) {
	case WikiReducerType.SET_STATE: {
		return payload
	}
	case WikiReducerType.SET_FIELD: {
		return {
			...state,
			[payload.target.name]: payload.target.value
		}
	}
	}
}

export const initalWiki: Wiki = {
	_id: '1',
	description: '',
	img: '',
	name: ''
}