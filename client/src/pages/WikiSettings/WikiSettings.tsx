// External dependencies
import { useNavigate, useParams } from 'react-router-dom'

// Internal dependencies
import { Column, Filler, Row } from '../../components/common/Layout'
import Card from '../../components/common/Card'
import useToast from '../../contexts/ToastContext'
import { Arrow, Check, Cross, Floppy, Pencil, Trash } from '../../assets/Icons'
import Button from '../../components/common/Button'
import { useEffect, useReducer, useState } from 'react'
import wikiAPI from '../../network/WikiAPI'
import wikiReducer, { initalWiki, WikiReducerType } from '../../reducers/WikiReducer'
import P from '../../components/common/text/P'
import ImageUploadButton from '../../components/ImageUpload'
import UserInput from '../../components/UserInput'
import User from '../../types/User'
import Divider from '../../components/common/Divider'
import Input from '../../components/common/Input'
import Textarea from '../../components/common/Textarea'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import Wiki from '../../types/Wiki'
import H4 from '../../components/common/text/H4'
import H5 from '../../components/common/text/H5'
import { LoadContextProvider } from '../../contexts/LoadContext'

import CSSstyle from './WikiSettings.module.css'
import MenuItem from '../../components/MenuItem'

export function WikiSettings() {
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
		wikiAPI.update(wiki._id, { ...wiki, img: filename },
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
			<Row className={CSSstyle.topRow}>
				<h1>Manage Wiki</h1>
				<Button
					text='Return to Wiki'
					outline
					color='var(--white)'
					onClick={() => navigate('/wiki/' + encodeURIComponent(wiki.name))}
				/>
			</Row>

			<Card className={CSSstyle.card}>
				<Column>
					<h2> {wiki.name} </h2>
					<MenuItem
						title='Wiki Name'
						description='Is displayed to all members of the wiki. Is used in links to the wiki and its pages. If it is changed old links to it will break.'
					>
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
								<P>{wiki.name}</P>
								<Button
									outline
									icon={<Pencil color='var(--black)' />}
									onClick={() => setWikiNameIsEdit(true)}
								/>
							</>
						)}
					</MenuItem>

					<MenuItem
						title='Cover Image'
						description='Image shown on the homepage for the wiki.'
					>
						<ImageUploadButton
							text='Change Cover Image'
							color='var(--white)'
							outline
							icon={<Pencil color='var(--black)' />}
							onImgUploaded={handleChangeImg}
						/>
					</MenuItem>

					<Row className={CSSstyle.row}>
						<Column style={{ gap: '0.25rem', width: '100%' }}>
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
							<Column>
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

					<Row>
						<Column style={{ gap: '0.25rem', width: '100%' }}>
							<Row className={CSSstyle.row}>
								<Column style={{ marginBottom: '0.55rem', gap: '0.25rem', }}>
									<H4>Manage Members</H4>
									<H5>Members of your wiki can create, edit and delete pages.</H5>
								</Column>
								<>
									{!arrHasSameContents(members, membersReference) && (
										<>
											<Filler />
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

					<MenuItem
						title='Export Wiki'
						description='Export all content associated with the Wiki. The export consist of a zip archive with all pages of the wiki, including their history.'
					>
						<Button
							outline
							text='Export Wiki'
							icon={<Floppy color='var(--black)' />}
							onClick={() => toast('This feature is not yet implemented,', 'warn')}
						/>
					</MenuItem>

					<MenuItem
						title='Import Pages'
						description='Pages previously exported can be imported into this wiki.'
					>
						<Button
							outline
							text='Import Pages'
							icon={<Arrow color='var(--black)' />}
							onClick={() => toast('This feature is not yet implemented,', 'warn')}
						/>
					</MenuItem>

					<Divider />

					<MenuItem
						title='Delete Wiki'
						description='Deleting a wiki will permanently remove all content associated with a wiki, i.e. its pages, page history, description and cover image.'
					>
						<Button
							text='Delete Wiki'
							color='var(--red)'
							icon={<Trash color='var(--white)' />}
							onClick={() => setDeleteConfirmationVisible(true)}
						/>
					</MenuItem>

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
	if (arr1.length !== arr2.length) return false
	return arr1.every((item: unknown) => arr2.includes(item))
}