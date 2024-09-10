// External dependencies
import { useNavigate, useParams } from 'react-router-dom'

// Internal dependencies
import { Column, Filler, Row } from '../../components/common/Layout'
import Card from '../../components/common/Card'
import useToast from '../../contexts/ToastContext'
import { Arrow, Check, Cross, Floppy, Pencil, Trash } from '../../assets/Icons'
import Button from '../../components/common/Button'
import { useReducer, useState } from 'react'
import wikiReducer, { initalWiki, WikiReducerType } from '../../reducers/WikiReducer'
import P from '../../components/common/text/P'
import ImageUploadButton from '../../components/ImageUpload'
import UserInput from '../../components/UserInput'
import Divider from '../../components/common/Divider'
import Input from '../../components/common/Input'
import Textarea from '../../components/common/Textarea'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import H4 from '../../components/common/text/H4'
import H5 from '../../components/common/text/H5'
import { LoadContextProvider } from '../../contexts/LoadContext'

import CSSstyle from './WikiSettings.module.css'
import MenuItem from '../../components/MenuItem'
import { gql } from '../../__generated__'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'

const REMOVE_WIKI = gql(`
	mutation RemoveWiki($_id: String!) {
		removeWiki(_id: $_id) {
			wiki {
				name
			}
		}
	}
`)

const UPDATE_WIKI = gql(`
	mutation UpdateWiki($wiki: UpdateWikiInput!) {
		updateWiki(input: $wiki) {
			wiki {
				_id
			}
		}
	}
`)

const GET_WIKI_BY_NAME = gql(`
	query GetWikiByName($name: String!) {
		wikisByName(name: $name) {
			wikis {
				img
				description
				name
				owner
				_id
			}
		}
	}
`)

const GET_MEMBERS = gql(`
	query GetWikiMembers($_id: String!) {
		wikiMembers(_id: $_id) {
			members {
				name
				_id
			}
		}
	}
`)

const UPDATE_MEMBERS = gql(`
	mutation UpdateWikiMembers($_id: String!, $members: [String]!) {
		updateWikiMembers(_id: $_id, members: $members) {
			members {
				name
				_id
			}
		}
	}
`)

export function WikiSettings() {
	const toast = useToast()

	const { wikiname } = useParams()
	if(!wikiname) throw new Error('wikiname not found in pathname.')

	const [wiki, dispatch] = useReducer(wikiReducer, initalWiki)

	const [members, setMembers] = useState<any[]>([])
	const [membersReference, setMembersReference] = useState<any[]>([])

	const [wikiNameIsEdit, setWikiNameIsEdit] = useState(false)
	const [descriptionIsEdit, setDescriptionIsEdit] = useState(false)
	const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false)

	const navigate = useNavigate()

	const wikiRequest = useQuery(GET_WIKI_BY_NAME, {variables: {name: wikiname}, onCompleted: data => {
		getWikiMembers({variables: {_id: data.wikisByName?.wikis[0]._id}})
		dispatch({type: WikiReducerType.SET_STATE, payload: data.wikisByName?.wikis[0]})
	}})

	const [getWikiMembers] = useLazyQuery(GET_MEMBERS, {
		onCompleted: data => {
			if(!data.wikiMembers?.members) throw new Error('Something went wrong!')
			setMembers(data.wikiMembers?.members)
			setMembersReference(data.wikiMembers?.members)
		},
		onError: err => {
			toast(err.message, 'error')
		}
	})

	const [deleteWiki] = useMutation(REMOVE_WIKI, {
		onCompleted: () => {
			navigate('/home')
			toast('Wiki was deleted successfully.', 'success')
		},
		onError: err => {
			toast(err.message, 'error')
			setDeleteConfirmationVisible(false)
		}
	})

	const [updateWiki] = useMutation(UPDATE_WIKI, {
		onCompleted: () => {
			toast('Wiki updated.', 'success')
		},
		onError: err => {
			toast(err.message, 'error')
		}
	})

	const submitEdit = (wiki: any) => {
		updateWiki({variables: { wiki:  {
			_id: wiki._id,
			description: wiki.description,
			img: wiki.img,
			name: wiki.name,
			owner: wiki.owner
		}}})
	}

	const handleChangeImg = (filename: string) => {
		submitEdit({ ...wiki, img: filename })
	}

	const [updateMembers] = useMutation(UPDATE_MEMBERS, {
		onCompleted: () => {
			toast('Wiki updated.', 'success')
		},
		onError: err => {
			toast(err.message, 'error')
		}
	})

	return (
		<LoadContextProvider loading={wikiRequest.loading} errored={wikiRequest.error != undefined}>
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
												onClick={() => updateMembers({variables: {_id: wiki._id!, members}})}
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
						onConfirm={() => deleteWiki({variables: {_id: wiki._id!}})}
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