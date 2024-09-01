import { useEffect, useReducer, useRef, useState } from 'react'

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
import FileAPI from '../network/FileAPI'
import wikiAPI from '../network/WikiAPI'
import useUser from '../contexts/UserContext'

export default function WikiCreator() {
	const navigate = useNavigate()

	const toast = useToast()

	const [filename, setFilename] = useState('')
	const filePickerRef = useRef(null)

	const { user } = useUser()

	const [wiki, dispatch] = useReducer(wikiReducer, initalWiki)

	const [members, setMembers] = useState<User[]>([])

	useEffect(() => {
		setMembers([user])
	},[])

	const onSubmit = () => {
		// LMAOOOO WHAT IS THIS CODE ;_;
		if(wiki.name == '') {
			toast('Wiki needs a name.', 'error')
			return
		}

		if(wiki.description == '') {
			toast('Wiki needs a description.', 'error')
			return
		}

		if(filename == '') {
			toast('Please select a cover image', 'error')
			return
		}

		if(!members.some(member => member._id == user._id)) {
			toast('You must be a member of the wiki you are creating.', 'error')
			setMembers([user])
			return
		}

		// Why did I un-promisify fetch calls, this code looks like a mess...
		// TODO: Rewrite all networking code to return promises instead. Va lite att göra :-))
		FileAPI.upload(filePickerRef,
			res => {
				const wikiWithImg = { ...wiki, img: res.filename }
				WikiAPI.create(wikiWithImg,
					createdWiki => {
						wikiAPI.updateMembers(createdWiki._id, members.map(user => user._id),
							() => {
								toast('Successfully created wiki', 'success')
								navigate('/wiki/' + createdWiki.name)
							},
							err => toast(err, 'error')
						)
					},
					err => toast(err, 'error'))
			},
			err => toast(err, 'error'))
	}

	return (
		<div style={{ margin: '0 auto', maxWidth: '500px' }}>
			<h1 style={{ marginBottom: '1rem' }}>Create Wiki</h1>

			<Card style={{ border: 'dashed 1.5px var(--gray)', width: '100%', padding: '1rem', boxSizing: 'border-box' }}>
				<Column>
					<Input
						placeholder='Wiki name'
						value={wiki.name}
						setValue={e => dispatch({ type: WikiReducerType.SET_FIELD, payload: e })}
						name='name'
					/>

					<Input
						placeholder='Description...'
						value={wiki.description}
						setValue={e => dispatch({ type: WikiReducerType.SET_FIELD, payload: e })}
						name='description'
					/>

					<h4 style={{ marginBottom: '-0.5rem' }}>Cover Image</h4>
					<Input
						value={filename}
						setValue={e => setFilename(e.target.value)}
						type='file'
						name='filepicker'
						ref={filePickerRef}
					/>

					<h4 style={{ marginBottom: '-0.5rem' }}>Members</h4>
					<UserInput
						addedUsers={members}
						setAddedUsers={setMembers}
						placeholder='Click and type to add users to your wiki'
					/>
					<p style={{ color: 'var(--gray)' }}>Users added as members of your wiki will be able to create, edit and delete pages in the wiki. They cannot delete or manage the wiki itself.</p>
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
