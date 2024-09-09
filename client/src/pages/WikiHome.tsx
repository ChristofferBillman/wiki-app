import { useState } from 'react'
import PageCard from '../components/PageCard'
import { Column, Row } from '../components/common/Layout'
import Page from '../types/Page'
import PageAPI from '../network/PageAPI'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import Placeholder from '../assets/img/placeholder.jpg'
import Button from '../components/common/Button'
import { Cogwheel, Plus } from '../assets/Icons'

import LoadedImg from '../components/common/LoadedImg'
import P from '../components/common/text/P'
import H1 from '../components/common/text/H1'
import { LoadContextProvider } from '../contexts/LoadContext'
import { useQuery, useLazyQuery } from '@apollo/client'
import { gql } from '../__generated__'
import { initalWiki } from '../reducers/WikiReducer'

const WIKIS_BY_NAME = gql(`
	query WikiByName($name: String!) {
		wikisByName(name: $name) {
			wikis {
				description
				name
				img
				_id
			}
		}
	}
`)

const ALL_PAGES_IN_WIKI = gql(`
	query AllPagesInWiki($_id: String!) {
		allPagesInWiki(_id: $_id) {
			pages {
				content
				infoSection
				authors
				wikiId
				_id
			}
		}
	}
`)
export default function WikiHome() {
	const { wikiname } = useParams()
	if(!wikiname) throw new Error('nope')
		
	const navigate = useNavigate()
	const location = useLocation()

	const {data, loading, error} = useQuery(WIKIS_BY_NAME, {
		variables: { name: wikiname },
		onCompleted: data => {
			allPagesInWiki(data.wikisByName?.wikis[0]._id)
		}
	})
	const wiki = data?.wikisByName?.wikis[0] ?? initalWiki

	const [allPagesInWiki, pagesRequest] = useLazyQuery(ALL_PAGES_IN_WIKI, {
		variables: { _id: wiki._id }
	})

	const pages = pagesRequest.data?.allPagesInWiki?.pages ?? []

	return (
		<>
			<LoadContextProvider loading={loading} errored={error != undefined}>
				<H1
					style={{
						color: '#fff',
						position: 'absolute',
						top: '23rem'}}
					skeletonStyle={{
						position: 'absolute',
						top: '23rem',
						width: '300px'}}
				>
					{wiki.name}
				</H1>

				<P
					style={{
						color: '#fff',
						position: 'absolute',
						top: '27rem',
						width:'75%'
					}}
					skeletonStyle={{
						position: 'absolute',
						top: '27rem',
						width: '75%'
					}}
				>
					{wiki.description}
				</P>

				<Row
					style={{ padding: 0, position: 'absolute', top: '33rem'}}
				>
					<Button
						text='New Page'
						color='var(--primary)'
						icon={<Plus/>}
						onClick={() => navigate(location.pathname + '/page/create')}
					/>
					<Button
						text='Manage Wiki'
						color='var(--white)'
						outline
						icon={<Cogwheel color='var(--black)'/>}
						onClick={() => navigate(location.pathname + '/settings')}
					/>
				</Row>

				{ loading ? (
					<div
						className='loader'
						style={{ height: '600px', width: '100vw', position: 'absolute', top: 0, left: 0, zIndex: -1}}
					/>
				):(
					<LoadedImg
						src={wiki.img ? '/api/uploads/' + wiki.img : Placeholder}
						style={{
							position: 'absolute',
							width: '100vw',
							height: '600px',
							top: 0,
							left: 0,
							zIndex: -1
						}}
						imgStyle={{
							objectFit: 'cover',
							height: '600px',
							filter: 'brightness(0.6)',
							position: 'relative'
						}}
					/>
				)}
			</LoadContextProvider>
			
			{/* Everything below is a mess and should be refactored */}
			<LoadContextProvider loading={pagesRequest.loading}>
				{pagesRequest.error != undefined ? (
					<>
						<h1 style={{margin: '35rem 0 1rem 0'}}> Oops! </h1>

						<h2>
							Looks like something went wrong, double check your internet connection and reload the page.
						</h2>
						<p style={{margin: '4rem 0 0 0'}}>Here is a more detailed description of the error:</p>
						<p>{pagesRequest.error.message + ' ' +  error?.message}</p>
					</>
				) : (
					<>
						<h1 style={{margin: '35rem 0 1rem 0'}}> All Pages </h1>

						<Row
							style={{
								flexWrap: 'wrap',
								gap: '2rem',
								padding: 0
							}}
						>
							{!pagesRequest.loading ? (
								pages.length == 0 ? <EmptyState/> : (
									pages.map(page => <PageCard key={page?._id} page={page}/>))
							): (
								sixElements.map(el => <PageCard key={el} loading/>)
							)}
						</Row>
					</>
				)}
			</LoadContextProvider>
		</>
	)
}

const sixElements = [1,2,3,4,5,6]

function EmptyState() {
	return (
		<Column>
			<h2>There are no pages in this wiki</h2>
			<p>Create one with the blue button above.</p>
		</Column>
	)
}
