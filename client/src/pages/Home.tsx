import { useEffect, useState } from 'react'
import { Column, Row } from '../components/common/Layout'

import useUser from '../contexts/UserContext'

import WikiAPI from '../network/WikiAPI'
import Wiki from '../types/Wiki'
import WikiCard from '../components/WikiCard'
import { LoadContextProvider } from '../contexts/LoadContext'

export default function Home() {

	const [wikis, setWikis] = useState<Wiki[]>([])
	const [error, setError] = useState<string>('')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		WikiAPI.all(wikis => {
			setWikis(wikis)
			setLoading(false)
		},
		err => setError(err))
	}, [])

	const userContext = useUser()
	const username = userContext.user?.name

	return (
		<Column style={{ margin: '0 auto' }}>
			<h1 style={{color: 'var(--white)'}}>Welcome {username}</h1>

			<h1>Your Wikis</h1>

			<Row style={{flexWrap: 'wrap', padding: 0 }}>
				{loading ? (
					<LoadContextProvider loading={loading} errored={error != ''}>
						{sixElements.map(num => <WikiCard key={num}/>)}
					</LoadContextProvider>
				) : (
					wikis.length == 0 ? 
						<EmptyState name={username}/> : 
						wikis.map(wiki => <WikiCard wiki={wiki} key={wiki._id}/>)
				)}
			</Row>
		</Column>
	)
}

const sixElements = [1,2,3,4,5,6]

interface EmptyStateProps {
	name: string | undefined
}

function EmptyState({name}: EmptyStateProps) {
	return (
		<Column>
			<h2>Wikis that you are a member of will show up here</h2>
			<p>Create one in the top right corner, or ask a friend to invite <strong>{name}</strong> to theirs</p>
		</Column>
	)
}

