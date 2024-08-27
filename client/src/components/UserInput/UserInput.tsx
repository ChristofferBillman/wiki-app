import { SetStateAction, useState } from 'react'

import useToast from '../../contexts/ToastContext'

import { Column, Row } from '../common/Layout'
import User from '../../types/User'
import UserAPI from '../../network/UserAPI'
import Button from '../common/Button'
import { Plus, Trash } from '../../assets/Icons'

import inputStyle from '../common/Input/Input.module.css'

interface Props {
	addedUsers: User[]
	setAddedUsers: React.Dispatch<SetStateAction<User[]>>
	placeholder?: string
}

export function UserInput({addedUsers, setAddedUsers, placeholder = 'Click and type to search users...'}: Props) {

	const [searchQuery, setSearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState<User[]>([])

	const toast = useToast()

	const search = (str: string) => {
		const query = str.trim()
		if (query.length > 0) {
			UserAPI.search(query, users => {
				const usersWithoutAdded = users.filter(u => !addedUsers.some(au => au._id === u._id))
				setSearchResults(usersWithoutAdded)
			}
			, err => toast(err, 'error'))
		} else {
			setSearchResults([])
		}
	}

	const handleAddUser = (user: User) => {
		setAddedUsers([...addedUsers, user])

		const addedExcluded = [...searchResults].filter(u => u._id !== user._id)
		setSearchResults(addedExcluded)
	}

	const handleRemoveUser = (user: User) => {
		const withUserRemoved = [...addedUsers].filter(au => au._id !== user._id)
		setAddedUsers(withUserRemoved)
		setSearchResults([user, ...searchResults])
	}

	return (
		<>
			<Column
				className={inputStyle.input}
				style={{ maxHeight: '1000px', height: '105px'}}
			>
				<input
					className={inputStyle.input}
					style={{ border: 'none'}}
					placeholder={placeholder}
					value={searchQuery}
					name='Search'
					onChange={e => {
						setSearchQuery(e.target.value)
						search(e.target.value)
					}}
				/>

				<Row style={{padding: 0}}>
					<>
						{addedUsers.map(user => (
							<Button
								text={user.name}
								color='var(--black)'
								outline
								icon={<Trash color='var(--white)'/>}
								key={user._id}
								onClick={() => handleRemoveUser(user)}
							/>
						))}
						{searchResults.map(user => (
							<Button
								text={user.name}
								color='var(--white)'
								outline
								icon={<Plus color='var(--black)'/>}
								key={user._id}
								onClick={() => handleAddUser(user)}
							/>
						))}
					</>
				</Row>
			</Column>


		</>
	)
}
