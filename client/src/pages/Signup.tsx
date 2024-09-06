import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../components/common/Input'
import Card from '../components/common/Card'
import { Row } from '../components/common/Layout'
import Button from '../components/common/Button'
import { Arrow } from '../assets/Icons'
import useUser from '../contexts/UserContext'
import useToast from '../contexts/ToastContext.tsx'
import { gql } from '../__generated__'
import { useMutation } from '@apollo/client'
import { LoadingIcon } from '../assets/Icons/LoadingIcon.tsx'

const CREATE_USER = gql(`
	mutation CreateUser($name: String!, $password: String!) {
		createUser(name: $name, password: $password) {
			token,
			user {
				name
				role
				_id
			}
		}
	}
	`)
export default function Signup() {

	const [name, setName] = useState('')
	const [password, setPassword] = useState('')

	const navigate = useNavigate()
	const toast = useToast()
	const {setUser} = useUser()

	const [createUser, { loading }] = useMutation(CREATE_USER, {
		onError: e => {
			toast(e.message, 'error')
		},
		onCompleted: (data: any) => {
			if (data?.createUser) {
				setUser(data.createUser.user)
				localStorage.setItem('token', data.createUser.token)
				navigate('/home')
			}
		}
	})

	return (
		<Row className='fillAvailable' style={{ alignItems: 'center', justifyContent: 'center'}}>
			<Card style={{ width: '300px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
				
				<h1 style={{ margin: 0 }}>Sign up</h1>

				<Input
					placeholder='Name'
					name='name'
					value={name}
					setValue={e => setName(e.target.value)}
				/>
				<Input
					placeholder='Password'
					name='password'
					type='password'
					value={password}
					setValue={e => setPassword(e.target.value)}
				/>

				<Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
					<Button
						text={loading ? 'Creating...' : 'Create Account'}
						color={loading ? 'var(--gray)' : 'var(--primary)'}
						icon={loading ? <LoadingIcon/> : <Arrow />}
						onClick={() => createUser({variables: {name, password}})}
						disabled={loading}
					/>
				</Row>
			</Card>
		</Row>
	)
}
