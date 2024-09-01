// External dependencies
import { useNavigate } from 'react-router-dom'

// Internal dependencies
import { Column, Filler, Row } from '../../components/common/Layout'
import Card from '../../components/common/Card'
import useToast from '../../contexts/ToastContext'
import useUser from '../../contexts/UserContext'
import { Arrow, Moon, Pencil, Sun } from '../../assets/Icons'
import Button from '../../components/common/Button'
import Divider from '../../components/common/Divider'
import { useThemeContextSetter } from '../../contexts/ThemeContext'
import UserAPI from '../../network/UserAPI'

import style from './Settings.module.css'
import MenuItem from '../../components/MenuItem'

export function Settings() {
	const { user, reset } = useUser()
	const toast = useToast()

	const setTheme = useThemeContextSetter()
	const navigate = useNavigate()

	const handleSignout = () => {
		UserAPI.logout(
			() => {
				reset()
				navigate('/login')
				toast('You have been signed out.', 'info')
			},
			err => toast(err, 'error')
		)
	}

	return (
		<>
			<Row className={style.topRow}>
				<h1>Settings</h1>
				<Filler />
				<Button
					text='Back'
					outline
					color='var(--white)'
					onClick={() => navigate(-1)}
				/>
			</Row>

			<Card className={style.card}>
				<Column>
					<h2>User</h2>
					<MenuItem
						title='Username'
						description='Your username is used to log in, and is also visible to other users.'
					>
						<h5>{user.name}</h5>
						<Button
							outline
							icon={<Pencil color='var(--black)' />}
							onClick={() => navigate('/settings/changeUsername')}
						/>
					</MenuItem>

					<MenuItem
						title='Password'
						description='Used to log in. If you forget your password, you need to contact admin.'
					>
						<Button
							outline
							icon={<Pencil color='var(--black)' />}
							onClick={() => navigate('/settings/changePassword')}
						/>
					</MenuItem>

					<Row className={style.row}>
						<Button
							outline
							text='Sign Out'
							icon={<Arrow color='var(--black)' />}
							onClick={handleSignout}
						/>
					</Row>

					<Divider />
					<h2>Customization</h2>

					<MenuItem
						title='Theme'
						description='Controls how the website is viewed for you.'
					>
						<Button
							outline
							icon={<Sun color='var(--black)' />}
							onClick={() => setTheme('light')}
						/>
						<Button
							outline
							icon={<Moon color='var(--black)' />}
							onClick={() => setTheme('dark')}
						/>
					</MenuItem>
				</Column>
			</Card>
		</>
	)
}