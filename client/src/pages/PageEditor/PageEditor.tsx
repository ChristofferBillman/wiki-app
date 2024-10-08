import { useEffect, useReducer, useState } from 'react'

// External Dependencies
import { useNavigate, useParams } from 'react-router-dom'

// Internal Dependencies
import { Column, Filler, Row } from '../../components/common/Layout'
import { Floppy, Trash } from '../../assets/Icons'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import PageContentEditor from '../../components/PageContentEditor'
import PageInfoEditor from '../../components/PageInfoEditor'

import ConfirmationModal from '../../components/common/ConfirmationModal'
import PageAPI from '../../network/PageAPI'
import useToast from '../../contexts/ToastContext'
import useUser from '../../contexts/UserContext'
import pageReducer, { PageReducerType, initalPage } from '../../reducers/PageReducer'
import Page from '../../types/Page'

import style from './PageEditor.module.css'

export default function PageEditor() {
	const { id } = useParams()
	const {user} = useUser()

	const [page, dispatch] = useReducer(pageReducer, initalPage)
	const [refencePage, setRefencePage] = useState(initalPage)

	const [modalVisible, setModalVisibility] = useState(false)

	const navigate = useNavigate()
	const toast = useToast()

	useEffect(() => {
		PageAPI.byId(id,
			page => {
				setRefencePage(page)
				dispatch({type: PageReducerType.SET_STATE, payload: page})
			},
			err => toast(err, 'error'))
	},[])

	const onSubmit = () => {
		if(!user || !id) {
			toast('Something went wrong when submitting edits.', 'error')
			return
		}

		PageAPI.update(id, page,
			() => {
				toast('Page edited', 'success')
				navigate(-1)
			},
			err => toast(err, 'error'))
	}

	const title = page.content.split('\n')[0].replace('#','')

	return (
		<>
			<ConfirmationModal
				prompt='You have unsaved changes.'
				text='Do you want to discard them?'
				visible={modalVisible}
				onCancel={() => setModalVisibility(false)}
				onConfirm={() => navigate(-1)}
				confirmText='Discard & Exit'
			/>
			
			<div style={{ margin: '0 auto', maxWidth: 'var(--page-max-width)' }}>
				<Row style={{ alignItems: 'center', flexWrap: 'wrap', padding: '1rem 0 1rem 0' }}>
					<h4 style={{color: 'var(--gray)'}}> Editing: {title} </h4>
					<Filler />
					<Row style={{justifyContent: 'flex-end', flex: 1}}>
						{!hasChanged(refencePage, page) ? 
							<Button
								outline
								text='Discard Changes'
								icon={<Trash color='var(--black)'/>}
								onClick={() => setModalVisibility(true)}
							/>
							:
							<Button
								outline
								text='Cancel'
								onClick={() => navigate(-1)}
							/>
						}
						<Button
							text='Save Changes'
							icon={<Floppy color='var(--white)' />}
							color='var(--primary)'
							onClick={onSubmit}
						/>
					</Row>
				</Row>

				<Card style={{border: 'dashed 1.5px var(--gray)', margin: '0 auto', width: '100%', padding: '2rem', boxSizing: 'border-box'}}>
					<Row className={style.editor}>
						<Column style={{flex: 1}}>
							<PageContentEditor page={page} dispatch={dispatch} />
						</Column>
						<Column style={{flex: 1 }}>
							<PageInfoEditor page={page} dispatch={dispatch}/>
						</Column>
					</Row>
				</Card>
			</div>
		</>
	)
}

// Might be laggy in the future when pages get really long.
// This runs every time a user types in an input.
// We'll see...
function hasChanged(reference: Page, changed: Page) {
	return reference.content === changed.content &&
		JSON.stringify(reference.infoSection) == JSON.stringify(changed.infoSection)
}