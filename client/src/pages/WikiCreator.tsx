import { useReducer, useState } from 'react'

// External Dependencies
import { useNavigate } from 'react-router-dom'

// Internal Dependencies
import { Column, Filler, Row } from '../components/common/Layout'
import { Plus, Trash } from '../assets/Icons'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import useToast from '../contexts/ToastContext'
import Input from '../components/common/Input'
import WikiAPI from '../network/WikiAPI'
import wikiReducer, { initalWiki, WikiReducerType } from '../reducers/WikiReducer'
import UserInput from '../components/UserInput'
import User from '../types/User'

export default function WikiCreator() {
	const navigate = useNavigate()

	const toast = useToast()

	const [wiki, dispatch] = useReducer(wikiReducer, initalWiki)

	const [members, setMembers] = useState<User[]>([])

	const onSubmit = () => {
		WikiAPI.create(wiki,
			() => {
				toast('Successfully created wiki', 'success')
				navigate(-1)
			},
			() => toast('Fill in all fields.', 'error'))
	}

	return (
		<div style={{ margin: '0 auto', maxWidth: '500px' }}>
			<h1 style={{marginBottom: '1rem'}}>Create Wiki</h1>

			<Card style={{ border: 'dashed 1.5px var(--gray)', width: '100%' }}>
				<Column>
					<Input
						placeholder='Wiki name'
						value={wiki.name}
						setValue={e => dispatch({type: WikiReducerType.SET_FIELD, payload: e})}
						name='name'
					/>

					<Input
						placeholder='Description...'
						value={wiki.description}
						setValue={e => dispatch({type: WikiReducerType.SET_FIELD, payload: e})}
						name='description'
					/>

					<UserInput
						addedUsers={members}
						setAddedUsers={setMembers}
						placeholder='Click and type to add users to your wiki'
					/>
				</Column>
			</Card>

			<Row style={{ alignItems: 'center', flexWrap: 'wrap', padding: '1rem 0 1rem 0' }}>
				<Filler />
				<Button
					outline
					text='Discard & Exit'
					icon={<Trash color='var(--black)' />}
					onClick={() => navigate(-1)}
				/>
				<Button
					text='Create Wiki'
					icon={<Plus color='var(--white)' />}
					color='var(--primary)'
					onClick={onSubmit}
				/>
			</Row>
		</div>
	)
}
