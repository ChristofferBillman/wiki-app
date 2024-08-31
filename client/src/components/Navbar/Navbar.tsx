import { Outlet, useNavigate } from 'react-router-dom'

import { Plus, Cogwheel, Home } from '../../assets/Icons'
import Button from '../common/Button'
import { Filler, Row } from '../common/Layout'

import SearchBar from '../SearchBar'
import style from './Navbar.module.css'

export function Navbar() {

	const navigate = useNavigate()

	return (
		<>
			<Row className={style.navbar}>
				<SearchBar/>

				<Filler/>
				<Row style={{padding: 0, flexWrap: 'wrap', justifyContent: 'flex-end'}}>
					<Button
						text='New Wiki'
						color='var(--primary)'
						icon={<Plus/>}
						onClick={() => {
							navigate('/wiki/create')
						}}
					/>
					<Button
						outline
						textColor='var(--gray)'
						icon={<Home color='var(--gray)'/>}
						onClick={() => {
							navigate('/home')
						}}
					/>
					<Button
						outline
						textColor='var(--gray)'
						icon={<Cogwheel color='var(--gray)'/>}
						onClick={() => {
							navigate('/settings')
						}}
					/>
				</Row>
			</Row>

			<Outlet/>
		</>
	)
}
