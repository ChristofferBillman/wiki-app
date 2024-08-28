import { useEffect, useState } from 'react'
import { Column, Row } from '../components/common/Layout'

import useUser from '../contexts/UserContext'

import Placeholder from '../assets/img/placeholder.jpg'
import WikiAPI from '../network/WikiAPI'
import Wiki from '../types/Wiki'
import WikiCard from '../components/WikiCard'

export default function Home() {

	const [wikis, setWikis] = useState<Wiki[]>([])
	const [_, setError] = useState<string>('')

	useEffect(() => {
		WikiAPI.all(wikis => setWikis(wikis), err => setError(err))
	}, [])

	const userContext = useUser()
	const username = userContext.user.name

	return (
		<>

			<Column style={{ margin: '0 auto', maxWidth: 'var(--page-max-width)' }}>
				<h1 style={{color: 'var(--white)'}}>Welcome {username}</h1>
				<img
					src={Placeholder}
					style={{position: 'absolute', width: '100vw', height: '400px', objectFit: 'cover', top: 0, left: 0, zIndex: -1, filter: 'brightness(0.6)'}}
				/>

				<div style={{height: '225px'}}/>

				<h1>Your Wikis</h1>
				<Row style={{flexWrap: 'wrap', padding: 0 }}>
					{wikis.map(wiki => <WikiCard wiki={wiki} key={wiki._id}/>)}
				</Row>
			</Column>
		</>
	)
}
