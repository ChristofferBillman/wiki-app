import {CSSProperties, useRef, useState} from 'react'

import Input from '../common/Input'
import SearchAPI from '../../network/SearchAPI'
import useToast from '../../contexts/ToastContext'
import Page from '../../types/Page'

import style from './SearchBar.module.css'
import {Filler, Row} from '../common/Layout'
import useOutsideClick from '../../hooks/useOutsideClick'
import {SearchResult} from './SearchResult'
import { useNavigate, useParams } from 'react-router-dom'
import wikiAPI from '../../network/WikiAPI'
import TransitionLifecycle from '../common/TransitionLifecycle'
import PageAPI from '../../network/PageAPI'

export function SearchBar() {

	const [searchQuery, setSearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState<Page[]>([])

	const { wikiname } = useParams()

	const [searchIsFocused, setSearchIsFocused] = useState(false)

	const visible = (searchResults.length > 0 && searchIsFocused)

	const toast = useToast()
	const navigate = useNavigate()

	const ref = useRef(null)
	useOutsideClick(ref, () => setSearchIsFocused(false))

	// If we are currently browsing in a wiki, search only in it by default, otherwise all wikis.
	const [searchMode, setSearchMode] = useState<'wiki' | 'everything'>(wikiname ? 'wiki' : 'everything')

	const toggleSearchMode = () => {
		if(searchMode == 'wiki') {
			setSearchMode('everything')
			search(searchQuery, 'everything')
		}
		else {
			setSearchMode('wiki')
			search(searchQuery, 'wiki')
		}
	}

	const search = (str: string, searchMode: 'wiki' | 'everything') => {
		const query = str.trim()

		if (query.length == 0) {
			setSearchResults([])
			return
		}

		if(searchMode == 'everything') {
			SearchAPI.search(query,
				pages => setSearchResults(pages),
				err => toast(err, 'error'))
		}
		else {
			if(!wikiname) throw new Error('Wikiname was not found in params.')

			PageAPI.allFromWiki(wikiname,
				pages => setSearchResults(pages),
				err => toast(err, 'error')
			)
		}
	}

	return (
		<>
			<Row id={style.searchContainer} forwardRef={ref}>
				<Input
					onFocus={() => {
						const mode = wikiname ? 'wiki' : 'everything'
						setSearchMode(mode)
						search(searchQuery, mode)
						setSearchIsFocused(true)
					}}
					placeholder={wikiname ? 'Search in ' + wikiname : 'Search Everything'}
					style={{width: '500px', zIndex: 100}}
					value={searchQuery}
					name='Search'
					setValue={e => {
						setSearchQuery(e.target.value)
						search(e.target.value, searchMode)
					}}
				/>

				<Transition visible={visible} id={style.searchResults}>
					<Row style={{padding: '1rem 1rem 0 1rem'}}>
						<p className={style.descriptionText}>
							{searchResults.length} Results {searchMode == 'wiki' ? '(in ' + wikiname + ')' : '(all wikis)'}
						</p>

						<Filler/>

						<h4
							className={style.clickableText}
							onClick={toggleSearchMode}
						>
							{wikiname ? (searchMode == 'wiki' ? 'Search everything' : 'Search in this wiki') : ''}
						</h4>
					</Row>
					{searchResults.map(page => (
						<div
							onClick={() => {
								wikiAPI.byId(page.wikiId, wiki => {
									navigate(`/wiki/${wiki.name}/page/${page._id}`)
									setSearchIsFocused(false)
								},
								err => toast(err, 'error')
								)
							}}
							key={page._id}
						>
							<SearchResult
								page={page}
							/>
						</div>)
					)}
				</Transition>
			</Row>
		</>
	)
}

interface TransitionProps {
	children: React.ReactNode
	visible: boolean
	style?: CSSProperties
	id?: string
}
function Transition({children, visible, id}: TransitionProps) {
	return (
		<TransitionLifecycle
			willRender={visible}
			transition={{
				initial: { opacity: 0, transform: 'translateY(-10px)' },
				transition: { opacity: 1, transform: 'translateY(0)' },
				exit: { opacity: 0, transform: 'translateY(10px)' },
				duration: 200
			}}
			id={id}
		>
			{children}
		</TransitionLifecycle>)
}
