import Wiki from '../types/wiki'
import { post, put, del, get } from './common/http'

async function all(onSuccess: (arg0: Wiki[]) => void, onError: (arg0: string) => void) {
	get('/wiki', onSuccess, onError)
}

async function byId(wikiId: string | undefined, onSuccess: (arg0: Wiki) => void, onError: (arg0: string) => void) {
	idGuard(wikiId)
	get('/wiki/' + wikiId, onSuccess, onError)
}

async function byName(wikiName: string, onSuccess: (arg0: Wiki) => void, onError: (arg0: string) => void) {
	get('/wiki?wikiName=' + wikiName, onSuccess, onError)
}

async function create(wikiData: Wiki, onSuccess: (arg0: unknown) => void, onError: (arg0: string) => void) {
	post(wikiData, '/wiki', onSuccess, onError)
}

async function update(wikiId: string | undefined, wikiData: Wiki, onSuccess: (arg0: unknown) => void, onError: (arg0: string) => void) {
	idGuard(wikiId)
	put(wikiData, `/wiki/${wikiId}`, onSuccess, onError)
}

async function remove(wikiId: string | undefined, onSuccess: (arg0: unknown) => void, onError: (arg0: string) => void) {
	idGuard(wikiId)
	del({}, `/wiki/${wikiId}`, onSuccess, onError)
}

async function addUserToWiki(wikiId: string, userId: string, onSuccess: (arg0: unknown) => void, onError: (arg0: string) => void) {
	put({wikiId, userId}, '/wiki/addUserToWiki', onSuccess, onError)
}

function idGuard(id: string | undefined) {
	if(!id) throw new Error('Tried to make request with a undefined or null wiki id')
}

const wikiAPI = {
	create,
	update,
	remove,
	all,
	byId,
	byName,
	addUserToWiki
}

export default wikiAPI