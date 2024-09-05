import { useState } from 'react'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import { Row } from '../components/common/Layout'
import Button from '../components/common/Button'
import { Arrow, Plus } from '../assets/Icons'
import { useNavigate } from 'react-router-dom'
import useUser from '../contexts/UserContext'
import useToast from '../contexts/ToastContext'
import { useLazyQuery } from '@apollo/client'
import { gql } from '../__generated__/gql'
import { LoadingIcon } from '../assets/Icons/LoadingIcon'

const LOGIN = gql(`
query Login($name: String!, $password: String!) {
	login(name: $name, password: $password) {
		token
		user {
			_id
			name
			role
		}
	}
}`)

export default function Login() {

	const [name, setName] = useState('')
	const [password, setPassword] = useState('')

	const navigate = useNavigate()
	const toast = useToast()

	const { setUser } = useUser()

	const [login, { loading }] = useLazyQuery(LOGIN, {
		onError: e => {
			toast(e.message, 'error')
		},
		onCompleted: data => {
			if (data?.login) {
				setUser(data.login.user)
				localStorage.setItem('token', data.login.token)
				navigate('/home')
			}
		}
	})

	return (
		<Row className='fillAvailable' style={{ alignItems: 'center', justifyContent: 'center' }}>
			<Card style={{ width: '300px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

				<h1 style={{ margin: 0 }}>Log in</h1>

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
						text={loading ? 'Logging in...' : 'Login'}
						color={loading ? 'var(--gray)' : 'var(--primary)'}
						icon={loading ? <LoadingIcon/> : <Arrow />}
						onClick={() => login({ variables: { name, password }})}
						disabled={loading}
					/>

					<Button
						text='Sign Up'
						outline
						icon={<Plus color='var(--black)' />}
						onClick={() => navigate('/signup')}
					/>
				</Row>
			</Card>
		</Row>
	)
}
