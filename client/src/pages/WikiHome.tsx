import { useEffect, useState } from 'react'
import PageCard from '../components/PageCard'
import { Row } from '../components/common/Layout'
import Page from '../types/Page'
import PageAPI from '../network/PageAPI'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Wiki from '../types/wiki'
import { initalWiki } from '../reducers/WikiReducer'
import wikiAPI from '../network/WikiAPI'

import Placeholder from '../assets/img/placeholder.jpg'
import Button from '../components/common/Button'
import { Cogwheel, Plus } from '../assets/Icons'

export default function WikiHome() {

	const [pages, setPages] = useState<Page[]>([])
	const [wiki, setWiki] = useState<Wiki>(initalWiki)
	const [error, setError] = useState('')

	const { wikiname } = useParams()
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		if(!wikiname) throw new Error('Wiki name not found in pathname.')
		PageAPI.allFromWiki(wikiname, pages => setPages(pages), err => setError(err))
		wikiAPI.byName(wikiname, wiki => setWiki(wiki), err => setError(err))
	},[])

	if(error != '') return (
		<>
			<h1>An error occured:</h1>
			<h5>{error}</h5>
		</>
	)

	return (
		<>
			<h1 style={{color: 'var(--white)', margin: ' 14rem 0 2rem 0'}}>{wiki.name}</h1>
			<p style={{color: 'var(--white)', marginBottom: '4rem'}}>{wiki.description}</p>

			<Row style={{ padding: 0, marginBottom: '6rem' }}>
				<Button
					text='New Page'
					color='var(--primary)'
					icon={<Plus/>}
					onClick={() => navigate(location.pathname + '/page/create')}
				/>
				<Button
					text='Wiki Settings'
					color='var(--white)'
					outline
					icon={<Cogwheel color='var(--black)'/>}
				/>
			</Row>
			<img
				src={wiki.img ? '/api/uploads/' + wiki.img : Placeholder}
				style={{position: 'absolute', width: '100vw', height: '600px', objectFit: 'cover', top: 0, left: 0, zIndex: -1, filter: 'brightness(0.6)'}}
			/>

			<h1 style={{marginBottom: '1rem'}}>All Pages</h1>

			<Row style={{ flexWrap: 'wrap', gap: '2rem', padding: 0 }}>
				{pages.map(page => <PageCard key={page._id} page={page}/>)}
			</Row>
		</>
	)
}
