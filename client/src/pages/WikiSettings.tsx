// External dependencies
import { useNavigate, useParams } from 'react-router-dom'

// Internal dependencies
import { Column, Filler, Row } from '../components/common/Layout'
import Card from '../components/common/Card'
import useToast from '../contexts/ToastContext'
import { Arrow, Check, Cross, Floppy, Pencil, Trash } from '../assets/Icons'
import Button from '../components/common/Button'
import { useEffect, useReducer, useState } from 'react'
import wikiAPI from '../network/WikiAPI'
import wikiReducer, { initalWiki, WikiReducerType } from '../reducers/WikiReducer'
import P from '../components/common/P'
import ImageUploadButton from '../components/ImageUpload'
import UserInput from '../components/UserInput'
import User from '../types/User'
import Divider from '../components/common/Divider'
import Input from '../components/common/Input'
import Textarea from '../components/common/Textarea'
import ConfirmationModal from '../components/common/ConfirmationModal'
import Wiki from '../types/Wiki'

export default function WikiSettings() {
	const toast = useToast()
	const { wikiname } = useParams()

	const [wiki, dispatch] = useReducer(wikiReducer, initalWiki)

	const [members, setMembers] = useState<User[]>([])
	const [membersReference, setMembersReference] = useState<User[]>([])

	const [wikiNameIsEdit, setWikiNameIsEdit] = useState(false)
	const [descriptionIsEdit, setDescriptionIsEdit] = useState(false)
	const [membersIsEdit, setMembersIsEdit] = useState(false)

	const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false)

	const navigate = useNavigate()

	useEffect(() => {
		if (!wikiname) throw new Error('wikiname not found in pathname.')
		wikiAPI.byName(wikiname,
			wiki => {
				if (!wiki._id) throw new Error('Wiki ID not found on wiki.')
				wikiAPI.getMembers(wiki._id,
					members => {
						setMembers(members)
						setMembersReference(members)
					},
					err => toast(err, 'error'))
				dispatch({ type: WikiReducerType.SET_STATE, payload: wiki })
			},
			err => toast(err, 'error')
		)
	}, [])

	const submitEdit = (wiki: Wiki) => {
		wikiAPI.update(wiki._id, wiki,
			wiki => toast(wiki.name + ' updated', 'success'),
			err => toast(err, 'error')
		)
	}

	const handleDeleteWiki = () => {
		wikiAPI.remove(wiki._id,
			wiki => {
				navigate('/home')
				toast(wiki.name + ' was deleted', 'success')
			},
			err => toast(err, 'error')
		)
	}

	const handleChangeImg = (filename: string) => {
		wikiAPI.update(wiki._id, {...wiki, img: filename},
			() => toast('Cover image updated', 'success'),
			err => toast(err, 'error')
		)
	}

	const handleEditMembers = () => {
		wikiAPI.updateMembers(wiki._id, members.map(member => member._id),
			() => {
				setMembersIsEdit(false)
				setMembersReference(members)
				toast('Changes to members were successful', 'success')
			},
			err => toast(err, 'error')
		)
	}

	const handleCancelEditMembers = () => {
		// We need some mechanism to tell userInput not to display search results yet. This can happen after the addedMembers array has been reset.
		setMembers(membersReference)
	}

	return (
		<>
			<Row style={{ alignItems: 'center', maxWidth: 'var(--page-max-width)', margin: '0 auto', justifyContent: 'space-between' }}>
				<h1>Manage Wiki</h1>
				<Button
					text='Return to Wiki'
					outline
					color='var(--white)'
					onClick={() => navigate(-1)}
				/>
			</Row>

			<Card style={{ margin: '0 auto', width: 'var(--page-max-width)', minHeight: '100vh' }}>
				<Column>
					<h2 style={{ paddingLeft: '1rem' }}> {wiki.name}</h2>
					<Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
						<Column style={{ padding: 0, gap: '0.25rem', width: '50%' }}>
							<h4>Wiki Name</h4>
							<h5>Is displayed to all members of the wiki. Is used in links to the wiki and its pages. If it is changed old links to it will break.</h5>
						</Column>
						<Row style={{ padding: 0, alignItems: 'center' }}>
							{wikiNameIsEdit ? (
								<>
									<Input
										value={wiki.name}
										setValue={e => dispatch({ type: WikiReducerType.SET_FIELD, payload: e })}
										name='name'
									/>
									<Button
										color='var(--primary)'
										icon={<Check />}
										onClick={() => {
											setWikiNameIsEdit(false)
											submitEdit(wiki)
										}}
									/>
								</>
							) : (
								<>
									<h5>{wiki.name}</h5>
									<Button
										outline
										icon={<Pencil color='var(--black)' />}
										onClick={() => setWikiNameIsEdit(true)}
									/>
								</>
							)}
						</Row>
					</Row>

					<Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
						<Column style={{ padding: 0, gap: '0.25rem' }}>
							<h4>Cover Image</h4>
							<h5>Image shown on the homepage for the wiki.</h5>
						</Column>

						<Filler />

						<ImageUploadButton
							text='Change Cover Image'
							color='var(--white)'
							outline
							icon={<Pencil color='var(--black)' />}
							onImgUploaded={handleChangeImg}
						/>
					</Row>

					<Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
						<Column style={{ padding: 0, gap: '0.25rem', width: '100%', height: '9rem'}}>
							<h4>Description</h4>
							<h5>The text shown on the homepage of the wiki.</h5>
							{descriptionIsEdit ? (
								
								<Textarea
									value={wiki.description}
									onChange={e => dispatch({ type: WikiReducerType.SET_FIELD, payload: e })}
									name='description'
									rows={2}
									placeholder='Description...'
								/>
							) : (
								<P>{wiki.description}</P>
							)}
						</Column>
						{descriptionIsEdit ? (
							<Column style={{padding: '2.5rem 0 0 0'}}>
								<Button
									color='var(--primary)'
									icon={<Check />}
									onClick={() => {
										submitEdit(wiki)
										setDescriptionIsEdit(false)
									}}
								/>
								<Button
									color='var(--white)'
									outline
									icon={<Cross color='var(--black)' />}
									onClick={() => {
										setDescriptionIsEdit(false)
									}}
								/>
							</Column>
						) : (
							<Button
								outline
								icon={<Pencil color='var(--black)' />}
								onClick={() => setDescriptionIsEdit(true)}
							/>
						)}
					</Row>

					<Divider />

					<Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
						<Column style={{ padding: 0, gap: '0.25rem', width: '100%' }}>
							<Row style={{ padding: 0, alignItems: 'center', justifyContent: 'space-between' }}>
								<div>
									<h4>Manage Members</h4>
									<h5 style={{ marginBottom: '1rem' }}>Members of your wiki can create, edit and delete pages.</h5>
								</div>
								<>
									{!arrHasSameContents(members, membersReference) && (
										<>
											<Filler/>
											<Button
												text={'Cancel'}
												color='var(--white)'
												outline
												onClick={handleCancelEditMembers}
											/>
											<Button
												text={'Save Changes'}
												color='var(--primary)'
												icon={<Floppy />}
												onClick={handleEditMembers}
											/>
										</>
									)}
								</>
							</Row>

							<UserInput
								addedUsers={members}
								setAddedUsers={setMembers}
								placeholder='Start typing to search for users...'
							/>
						</Column>
					</Row>

					<Divider />

					<Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
						<Column style={{ padding: 0, gap: '0.25rem', width: '50%' }}>
							<h4>Export Wiki</h4>
							<h5>Export all content associated with the Wiki. The export consist of a zip archive with all pages of the wiki, including their history.</h5>
						</Column>
						<Button
							outline
							text='Export Wiki'
							icon={<Floppy color='var(--black)' />}
							onClick={() => toast('This feature is not yet implemented,','warn')}
						/>
					</Row>

					<Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
						<Column style={{ padding: 0, gap: '0.25rem', width: '50%' }}>
							<h4>Import Pages</h4>
							<h5>Pages previously exported can be imported into this wiki.</h5>
						</Column>
						<Button
							outline
							text='Import Pages'
							icon={<Arrow color='var(--black)' />}
							onClick={() => toast('This feature is not yet implemented,','warn')}
						/>
					</Row>

					<Divider />

					<Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
						<Column style={{ padding: 0, gap: '0.25rem', width: '50%' }}>
							<h4>Delete Wiki</h4>
							<h5>Deleting a wiki will permanently remove all content associated with a wiki, i.e. its pages, page history, description and cover image.</h5>
						</Column>
						<Button
							text='Delete Wiki'
							color='var(--red)'
							icon={<Trash color='var(--white)' />}
							onClick={() => setDeleteConfirmationVisible(true)}
						/>
					</Row>

					<ConfirmationModal
						prompt={`Are you sure you want to delete the wiki "${wikiname}"`}
						text='Deleting a wiki will permanently remove all content associated with it, i.e. its pages, page history, description and cover image. This is an irreversible action.'
						onCancel={() => setDeleteConfirmationVisible(false)}
						onConfirm={handleDeleteWiki}
						visible={deleteConfirmationVisible}
						confirmText={`Delete "${wikiname}"`}
					/>

				</Column>
			</Card>
		</>
	)
}

function arrHasSameContents(arr1: Array<unknown>, arr2: Array<unknown>) {
	if(arr1.length !== arr2.length) return false
	return arr1.every((item: unknown) => arr2.includes(item))
}