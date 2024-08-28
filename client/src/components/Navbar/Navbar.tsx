import { Outlet, useNavigate } from 'react-router-dom'

import { Plus, Cogwheel, Cross, Reorder, Person } from '../../assets/Icons'
import Button from '../common/Button'
import { Filler, Row } from '../common/Layout'

import SearchBar from '../SearchBar'
import style from './Navbar.module.css'
import { useState } from 'react'
import useUser from '../../contexts/UserContext'

export function Navbar() {

	const navigate = useNavigate()

	const { user } = useUser()

	const [menuOpen, setMenuOpen] = useState(false)

	return (
		<>
			<Row className={style.navbar}>
				<Row className={style.topBar}>
					<Button
						outline
						icon={<Reorder color='var(--gray)'/>}
						className={style.closeButton}
						onClick={() => setMenuOpen(!menuOpen)}
					/>
				</Row>

				<SearchBar/>

				<Filler/>
				<Row className={`${style.optionsContainer} ${ menuOpen ? style.open : style.closed}`}>
					<Button
						outline
						icon={<Cross color='var(--gray)'/>}
						className={style.closeButton}
						onClick={() => setMenuOpen(!menuOpen)}
					/>
					<Button
						text='New Wiki'
						color='var(--primary)'
						icon={<Plus/>}
						onClick={() => {
							setMenuOpen(false)
							navigate('/wiki/create')
						}}
					/>
					<Button
						outline
						text={user.name}
						textColor='var(--gray)'
						icon={<Person color='var(--gray)'/>}
						onClick={() => {
							setMenuOpen(false)
							navigate('/home')
						}}
					/>
					<Button
						outline
						text='Settings'
						textColor='var(--gray)'
						icon={<Cogwheel color='var(--gray)'/>}
						onClick={() => {
							setMenuOpen(false)
							navigate('/settings')
						}}
					/>
				</Row>
			</Row>

			<Outlet/>
		</>
	)
}
