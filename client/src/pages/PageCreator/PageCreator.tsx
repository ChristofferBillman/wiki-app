import { useReducer } from 'react'

// External Dependencies
import { useNavigate, useParams } from 'react-router-dom'

// Internal Dependencies
import { Column, Filler, Row } from '../../components/common/Layout'
import { Floppy, Trash } from '../../assets/Icons'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import PageContentEditor from '../../components/PageContentEditor'
import PageInfoEditor from '../../components/PageInfoEditor'
import PageAPI from '../../network/PageAPI'
import useToast from '../../contexts/ToastContext'
import pageReducer, { initalPage } from '../../reducers/PageReducer'

import style from './pageCreatorStyle.module.css'
import wikiAPI from '../../network/WikiAPI'

export default function PageCreator() {
	const navigate = useNavigate()
	const { wikiname } = useParams()

	if(!wikiname) throw new Error('Wiki name not found in pathname.')

	const [page, dispatch] = useReducer(pageReducer, initalPage)

	const toast = useToast()

	const title = page.content.split('\n')[0].replace('#','')

	const onSubmit = () => {
		wikiAPI.byName(wikiname, wiki => {
			const pageWithWikiId = {...page, wikiId: wiki._id}

			PageAPI.create(pageWithWikiId,
				() => {
					toast('Successfully added page', 'success')
					navigate(-1)
				},
				() => toast('Cannot submit empty page.', 'error'))
		},
		err => {
			toast(err, 'error')
		})
	}
	
	return (
		<div style={{ margin: '0 auto', maxWidth: 'var(--page-max-width)' }}>
			<Row style={{ alignItems: 'center', flexWrap: 'wrap', padding: '1rem 0 1rem 0' }}>
				<h4 style={{color: 'var(--gray)'}}> Creating: {title} </h4>
				<Filler/>
				<Row style={{justifyContent: 'flex-end', flex: 1}}>
					<Button
						outline
						text='Discard & Exit'
						icon={<Trash color='var(--black)'/>}
						onClick={() => navigate(-1)}
					/>
					<Button
						text='Submit'
						icon={<Floppy color='var(--white)' />}
						color='var(--primary)'
						onClick={onSubmit}
					/>
				</Row>
			</Row>

			<Card style={{border: 'dashed 1.5px var(--gray)', width: '100%', padding: '2rem', boxSizing: 'border-box' }}>
				<Row className={style.editor}>
					<Column style={{flex: 1}}>
						<PageContentEditor page={page} dispatch={dispatch} />
					</Column>
					<Column style={{flex: 1}}>
						<PageInfoEditor page={page} dispatch={dispatch} />
					</Column>
				</Row>
			</Card>
		</div>
	)
}
