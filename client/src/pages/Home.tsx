import { useEffect, useState } from 'react'
import { Column, Filler, Row } from '../components/common/Layout'
import SearchBar from '../components/SearchBar'

import useUser from '../contexts/UserContext'

import Placeholder from '../assets/img/placeholder.jpg'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import { Cogwheel, Person, Plus } from '../assets/Icons'
import WikiAPI from '../network/WikiAPI'
import Wiki from '../types/wiki'
import WikiCard from '../components/WikiCard'

export default function Home() {

	const [wikis, setWikis] = useState<Wiki[]>([])
	const [error, setError] = useState<string>('')

	useEffect(() => {
		WikiAPI.all(wikis => setWikis(wikis), err => setError(err))
	}, [])

	const navigate = useNavigate()

	const userContext = useUser()
	const username = userContext.user.name

	return (
		<>

			<Column>
				<Row>
					<SearchBar/>
					<Filler/>
					<Button
						text='Create Wiki'
						color='var(--primary)'
						icon={<Plus/>}
						onClick={() => navigate('/wiki/create')}
					/>
					<Button
						text={username}
						outline
						icon={<Person color='var(--black)'/>}
					/>
					<Button
						outline
						icon={<Cogwheel color='var(--black)'/>}
						onClick={() => navigate('/settings')}
					/>
				</Row>
				<h1 style={{color: 'var(--white)'}}>Welcome {username}</h1>
				<img
					src={Placeholder}
					style={{position: 'absolute', width: '100vw', height: '400px', objectFit: 'cover', top: 0, left: 0, zIndex: -1, filter: 'brightness(0.6)'}}
				/>

				<div style={{height: '200px'}}/>

				<h1>Your Wikis</h1>
				<>{wikis.map(wiki => <WikiCard wiki={wiki} key={wiki._id}/>)}</>
			</Column>
		</>
	)
}
