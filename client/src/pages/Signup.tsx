import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../components/common/Input'
import Card from '../components/common/Card'
import { Row } from '../components/common/Layout'
import Button from '../components/common/Button'
import { Arrow } from '../assets/Icons'
import UserAPI from '../network/UserAPI'
import useUser from '../contexts/UserContext'
import useToast from '../contexts/ToastContext.tsx'

export default function Signup() {

	const [name, setName] = useState('')
	const [password, setPassword] = useState('')

	const navigate = useNavigate()
	const toast = useToast()
	const {setUser} = useUser()

	const onSubmit = () => {
		UserAPI.signup(name,password,
			user => {
				setUser(user)
				navigate('/home')
			},
			err => toast(err, 'error'))
	}

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
						text='Create Account'
						color='var(--primary)'
						icon={<Arrow />}
						onClick={onSubmit}
					/>
				</Row>
			</Card>
		</Row>
	)
}
