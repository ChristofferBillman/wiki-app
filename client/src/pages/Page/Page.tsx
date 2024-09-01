// External dependencies
import { useLocation, useNavigate, useParams } from 'react-router-dom'

// Internal dependencies
import { Column, Row } from '../../components/common/Layout'
import { Pencil, Trash, History, Arrow } from '../../assets/Icons'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import PageContentSection from '../../components/PageContentSection'
import PageInfoSection from '../../components/PageInfoSection'

import { useEffect, useState } from 'react'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import IPage from '../../types/Page'
import PageAPI from '../../network/PageAPI'
import useToast from '../../contexts/ToastContext'
import UserAPI from '../../network/UserAPI'
import User from '../../types/User'
import { initalPage } from '../../reducers/PageReducer'
import P from '../../components/common/text/P'

import style from './Page.module.css'
import { LoadContextProvider } from '../../contexts/LoadContext'

export default function Page() {

	const { id } = useParams()
	const toast = useToast()

	const [page, setPage] = useState<IPage>(initalPage)
	const [lastEditor, setLastEditor] = useState<User>({ name: 'user_missing', _id: '0'})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [modalVisible, setModalVisibility] = useState(false)

	const navigate = useNavigate()
	const location = useLocation()
	const { wikiname } = useParams()

	useEffect(() => {
		PageAPI.byId(id,
			async page => {
				setPage(page)
				getLastEditor(page)
			},
			err => {
				toast('Failed to load page', 'error')
				setError(err + '.')
			})
	}, [id])

	const getLastEditor = (page: IPage) => {
		if (page.authors.length === 0) {
			setLoading(false)
			return
		}
		const id = page.authors[page.authors.length - 1]

		UserAPI.byId(id,
			user => {
				setLastEditor(user)
				setLoading(false)
			},
			err => {
				setLoading(false)
				toast(err, 'error')
			})
	}

	const handleDelete = () => {
		PageAPI.remove(id,
			() => {
				toast('Page deleted', 'success')
				navigate(-1)
			},
			err => {
				toast(err, 'error')
			})
	}

	return (
		<div style={{ margin: '0 auto', maxWidth: 'var(--page-max-width)' }}>
			<LoadContextProvider loading={loading} errored={error != ''}>
				<Row className={style.topRow}>
					<P>Last edited by {lastEditor.name}</P>
					<Row className={style.buttonsRow}>
						<Button
							outline
							text='Edit'
							onClick={() => navigate(location.pathname + '/edit')}
							icon={<Pencil color='var(--black)' />}
						/>
						<Button
							outline
							text='Delete'
							icon={<Trash color='var(--black)' />}
							onClick={() => setModalVisibility(true)}
						/>
						<Button
							outline
							text='History'
							icon={<History color='var(--black)' />}
							onClick={() => navigate(location.pathname + '/history')}
						/>
						<Button
							outline
							text='Return to Wiki'
							icon={<Arrow color='var(--black)' direction='right'/>}
							onClick={() => navigate('/wiki/' + wikiname)}
						/>
					</Row>
				</Row>
			</LoadContextProvider>

			<ConfirmationModal
				prompt='Are you sure you want to delete this page?'
				text='This is an irreversible action.'
				visible={modalVisible}
				onCancel={() => setModalVisibility(false)}
				onConfirm={handleDelete}
			/>

			<Card style={{ margin: '0 auto', width: 'var(--page-max-width)', minHeight: '100vh' }}>
				<Row className={style.pageContainer}>
					<Column style={{flex: 4}} loading={loading}>
						<PageContentSection markdown={page.content} />
					</Column>
					<Column style={{flex: 3}} loading={loading}>
						<PageInfoSection infoSection={page.infoSection} />
					</Column>
				</Row>
			</Card>
		</div>
	)
}