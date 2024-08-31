import { useEffect, useState } from 'react'
import PageCard from '../components/PageCard'
import { Row } from '../components/common/Layout'
import Page from '../types/Page'
import PageAPI from '../network/PageAPI'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Wiki from '../types/Wiki'
import { initalWiki } from '../reducers/WikiReducer'
import wikiAPI from '../network/WikiAPI'

import Placeholder from '../assets/img/placeholder.jpg'
import Button from '../components/common/Button'
import { Cogwheel, Plus } from '../assets/Icons'

import LoadedImg from '../components/common/LoadedImg'
import P from '../components/common/P'
import H1 from '../components/common/H1'

export default function WikiHome() {

	const [pages, setPages] = useState<Page[]>([])
	const [wiki, setWiki] = useState<Wiki>(initalWiki)

	const [pagesLoading, setPagesLoading] = useState(true)
	const [wikiLoading, setWIkiLoading] = useState(true)

	const [error, setError] = useState('')

	const { wikiname } = useParams()
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		if(!wikiname) return setError('Wiki name not found in pathname.')

		PageAPI.allFromWiki(wikiname,
			pages => {
				setPages(pages)
				setPagesLoading(false)
			},
			err => { setError(err)
				setError(err)
			})

		wikiAPI.byName(wikiname,
			wiki => {
				setWiki(wiki)
				setWIkiLoading(false)
			},
			err => {
				setError(err)
			})
	},[])

	if(error != '') return (
		<>
			<h1>An error occured:</h1>
			<h5>{error}</h5>
		</>
	)

	return (
		<>
			<H1 style={{color: 'red', position: 'absolute', top: '23rem'}} loading={wikiLoading}>{wiki.name}</H1>
			<P style={{color: 'red', position: 'absolute', top: '27rem'}} loading={wikiLoading}>{wiki.description}</P>

			<Row style={{ padding: 0, position: 'absolute', top: '33rem'}}>
				<Button
					text='New Page'
					color='var(--primary)'
					icon={<Plus/>}
					onClick={() => navigate(location.pathname + '/page/create')}
					loading={wikiLoading}
				/>
				<Button
					text='Manage Wiki'
					color='var(--white)'
					outline
					icon={<Cogwheel color='var(--black)'/>}
					onClick={() => navigate(location.pathname + '/settings')}
					loading={wikiLoading}
				/>
			</Row>

			{ wikiLoading ? (
				<div className='loader' style={{ height: '600px', width: '100vw', position: 'absolute', top: 0, left: 0, zIndex: -1}}/>
			):(
				<LoadedImg
					src={wiki.img ? '/api/uploads/' + wiki.img : Placeholder}
					style={{position: 'absolute', width: '100vw', height: '600px', top: 0, left: 0, zIndex: -1}}
					imgStyle={{ objectFit: 'cover', height: '600px', filter: 'brightness(0.6)', position: 'relative'}}
				/>
			)}
			

			<h1 style={{margin: '33rem 0 1rem 0'}}>All Pages</h1>

			<Row style={{ flexWrap: 'wrap', gap: '2rem', padding: 0 }}>
				{!pagesLoading ? (
					pages.map(page => <PageCard key={page._id} page={page}/>)
				): (
					sixElements.map(el => <PageCard key={el} loading/>)
				)}
			</Row>
		</>
	)
}

const sixElements = [1,2,3,4,5,6]
