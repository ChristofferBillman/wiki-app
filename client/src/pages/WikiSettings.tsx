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
import P from '../components/common/text/P'
import ImageUploadButton from '../components/ImageUpload'
import UserInput from '../components/UserInput'
import User from '../types/User'
import Divider from '../components/common/Divider'
import Input from '../components/common/Input'
import Textarea from '../components/common/Textarea'
import ConfirmationModal from '../components/common/ConfirmationModal'
import Wiki from '../types/Wiki'
import H4 from '../components/common/text/H4'
import H5 from '../components/common/text/H5'
import { LoadContextProvider } from '../contexts/LoadContext'

export default function WikiSettings() {
	const toast = useToast()
	const { wikiname } = useParams()

	const [wiki, dispatch] = useReducer(wikiReducer, initalWiki)

	const [members, setMembers] = useState<User[]>([])
	const [membersReference, setMembersReference] = useState<User[]>([])

	const [wikiNameIsEdit, setWikiNameIsEdit] = useState(false)
	const [descriptionIsEdit, setDescriptionIsEdit] = useState(false)

	const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false)

	const [error, setError] = useState('')
	const [loading, setLoading] = useState(true)

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
						setLoading(false)
					},
					err => {
						toast(err, 'error')
						setError(err + '.')
					})
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
				setMembersReference(members)
				toast('Changes Applied', 'success')
			},
			err => toast(err, 'error')
		)
	}

	return (
		<LoadContextProvider loading={loading} errored={error != ''}>
			<Row style={{ alignItems: 'center', maxWidth: 'var(--page-max-width)', margin: '0 auto', justifyContent: 'space-between' }}>
				<h1>Manage Wiki</h1>
				<Button
					text='Return to Wiki'
					outline
					color='var(--white)'
					onClick={() => navigate('/wiki/' + wiki.name)}
				/>
			</Row>

			<Card style={{ margin: '0 auto', width: 'var(--page-max-width)', minHeight: '100vh' }}>
				<Column>
					<h2 style={{ paddingLeft: '1rem' }}> {wiki.name}</h2>
					<Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
						<Column style={{ padding: 0, gap: '0.25rem', width: '50%' }}>
							<H4> Wiki Name </H4>
							<H5>
								Is displayed to all members of the wiki. Is used in links to the wiki and its pages. If it is changed old links to it will break.
							</H5>
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
									<H5>{wiki.name}</H5>
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
							<H4>Cover Image</H4>
							<H5>Image shown on the homepage for the wiki.</H5>
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
							<H4>Description</H4>
							<H5>The text shown on the homepage of the wiki.</H5>
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
									<H4>Manage Members</H4>
									<H5 style={{ marginBottom: '1rem' }}>Members of your wiki can create, edit and delete pages.</H5>
								</div>
								<>
									{!arrHasSameContents(members, membersReference) && (
										<>
											<Filler/>
											<Button
												text={'Cancel'}
												color='var(--white)'
												outline
												onClick={() => setMembers(membersReference)}
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
							<H4>Export Wiki</H4>
							<H5>Export all content associated with the Wiki. The export consist of a zip archive with all pages of the wiki, including their history.</H5>
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
							<H4>Import Pages</H4>
							<H5>Pages previously exported can be imported into this wiki.</H5>
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
							<H4>Delete Wiki</H4>
							<H5>Deleting a wiki will permanently remove all content associated with a wiki, i.e. its pages, page history, description and cover image.</H5>
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
		</LoadContextProvider>
	)
}

function arrHasSameContents(arr1: Array<unknown>, arr2: Array<unknown>) {
	if(arr1.length !== arr2.length) return false
	return arr1.every((item: unknown) => arr2.includes(item))
}