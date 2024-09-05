import { Column, Row } from '../components/common/Layout'

import useUser from '../contexts/UserContext'

import WikiCard from '../components/WikiCard'
import { LoadContextProvider } from '../contexts/LoadContext'
import { useQuery } from '@apollo/client'
import { gql } from '../__generated__'

const MY_WIKIS = gql(`
	query MyWikis {
		myWikis {
			wikis {
				name
				description
				img
				_id
			}
		}
	}
`)
export default function Home() {

	const { data, loading, error } = useQuery(MY_WIKIS)
	const wikis = data?.myWikis?.wikis ?? []

	const userContext = useUser()
	const username = userContext.user.name

	return (
		<Column style={{ margin: '0 auto' }}>
			<h1 style={{ color: 'var(--white)' }}>Welcome {username}</h1>

			<h1>Your Wikis</h1>

			<>
				{error && (
					<>
						<h2> Looks like something went wrong, double check your internet connection and reload the page.</h2>
						<p>{error.message}</p>
					</>
				)}
			</>
			<Row style={{ flexWrap: 'wrap', padding: 0 }}>
				<>
					{!data && (
						<LoadContextProvider loading={loading} errored={error != undefined}>
							{sixElements.map(num => <WikiCard key={num} />)}
						</LoadContextProvider>
					)}
					{!loading && !error && (
						wikis.length === 0
							? <EmptyState name={username} />
							: wikis.map(wiki => <WikiCard wiki={wiki} key={wiki._id} />)
					)}
				</>
			</Row>
		</Column>
	)
}

const sixElements = [1, 2, 3, 4, 5, 6]

interface EmptyStateProps {
	name: string
}

function EmptyState({ name }: EmptyStateProps) {
	return (
		<Column>
			<h2>Wikis that you are a member of will show up here</h2>
			<p>Create one in the top right corner, or ask a friend to invite <strong>{name}</strong> to theirs</p>
		</Column>
	)
}

