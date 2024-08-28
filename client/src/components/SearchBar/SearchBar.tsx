import {CSSProperties, useRef, useState} from 'react'

import Input from '../common/Input'
import SearchAPI from '../../network/SearchAPI'
import useToast from '../../contexts/ToastContext'
import Page from '../../types/Page'

import style from './SearchBar.module.css'
import {Row} from '../common/Layout'
import useOutsideClick from '../../hooks/useOutsideClick'
import {SearchResult} from './SearchResult'
import { useNavigate } from 'react-router-dom'
import wikiAPI from '../../network/WikiAPI'
import TransitionLifecycle from '../common/TransitionLifecycle'

export function SearchBar() {

	const [searchQuery, setSearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState<Page[]>([])

	const [searchIsFocused, setSearchIsFocused] = useState(false)

	const visible = (searchResults.length > 0 && searchIsFocused)

	const toast = useToast()
	const navigate = useNavigate()

	const ref = useRef(null)
	useOutsideClick(ref, () => {
		setSearchIsFocused(false)
	})

	const search = (str: string) => {
		const query = str.trim()
		if (query.length > 0) {
			SearchAPI.search(query, pages => {
				setSearchResults(pages)
			}
			, err => toast(err, 'error'))
		} else {
			setSearchResults([])
		}
	}

	return (
		<>
			<Row id={style.searchContainer} forwardRef={ref}>
				<Input
					onFocus={() => setSearchIsFocused(true)}
					placeholder='Search Everything'
					style={{width: '500px', zIndex: 100}}
					value={searchQuery}
					name='Search'
					setValue={e => {
						setSearchQuery(e.target.value)
						search(e.target.value)
					}}
				/>

				<Transition visible={visible} id={style.searchResults}>
					<p
						className={style.descriptionText}
						style={{margin: '1rem 0 0 1rem'}}
					>
						{searchResults.length} Results
					</p>
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
