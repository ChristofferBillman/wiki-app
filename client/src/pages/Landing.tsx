import { useNavigate } from 'react-router-dom'

import { Column, Filler, Row } from '../components/common/Layout'
import Button from '../components/common/Button'
import { Arrow, Plus } from '../assets/Icons'

import Promo1 from '../assets/img/promo1.png'
import Promo2 from '../assets/img/promo2.png'
import Promo3 from '../assets/img/promo3.png'
import Promo4 from '../assets/img/promo4.png'


export default function Landing() {

	const navigate = useNavigate()

	return (
		<>
			<Row>
				<p>stocken.wiki</p>
				<Filler/>
				<Button
					text='Create an account'
					color='var(--primary)'
					outline
					icon={<Plus/>}
					onClick={() => navigate('/signup')}
				/>
				<Button
					text='Log in'
					color='var(--white)'
					outline
					icon={<Arrow color='var(--black)'/>}
					onClick={() => navigate('/login')}
				/>
			</Row>
			<Column style={{ margin: '0 auto', maxWidth: '1500px'}}>
				<div style={{height: '16rem'}}/>

				<h1 style={{fontSize: '64px'}}>
					Looking for a place where you<br/>
					can make worlds come alive?<br/>
					This is it.
				</h1>

				<div style={{height: '16rem'}}/>
				
				<PromoSection
					img={Promo1}
					title='One place for all your worldbuilding'
					description='Collect and document anything you like in an easy to use and simple interface.'
				/>

				<div style={{height: '8rem'}}/>

				<PromoSection
					img={Promo2}
					imgPlacement='left'
					title='See the history of your wiki as it evolves'
					description="All edits and changes to pages are saved and can be viewed at any time. Regret an edit? Or someone made changes you didn't like? Just restore the page to a previous version with a few clicks - it's like nothing happened."
				/>

				<div style={{height: '8rem'}}/>

				<PromoSection
					img={Promo3}
					imgPlacement='right'
					title='Collaborate and edit pages together'
					description='Invite friends and collaborators to your wiki. They can view, edit and create new pages, so that your world evolves and changes even further.'
				/>

				<div style={{height: '8rem'}}/>

				<PromoSection
					img={Promo4}
					imgPlacement='left'
					title='Extensive and flexible pages'
					description='Pages are saved as Markdown files, giving them support for inline images, hyperlinks and text formatting options. This gives you the freedom to customize and setup your pages however you like.'
				/>

			</Column>

			<Column style={{background: 'var(--black)', height: '400px', margin: '0 -2rem -2rem', padding: '4em', alignItems: 'center'}}>
				<h1 style={{color: 'var(--white)', fontSize: '32px'}}>What are you waiting for?</h1>
				<div style={{height: '2rem'}}/>
				<Button
					text='Create an account'
					color='var(--primary)'
					icon={<Plus/>}
					onClick={() => navigate('/signup')}
				/>
				<div style={{height: '2rem'}}/>
				<p style={{color: 'var(--white)'}}>Already have an account?</p>
				<Button
					text='Log in'
					color='var(--white)'
					outline
					icon={<Arrow color='var(--black)'/>}
					onClick={() => navigate('/login')}
				/>
			</Column>
		</>
	)
}

interface PromoSectionProps {
	img: string
	title: string
	description: string
	imgPlacement?: 'left' | 'right'
}

function PromoSection({img, title, description, imgPlacement='right'}: PromoSectionProps) {
	const imgSide = imgPlacement == 'left' ? 'row-reverse' : 'row'

	return (
		<Row style={{justifyContent: 'space-between', flexDirection: imgSide}}>
			<Column style={{justifyContent: 'center', width: '400px'}}>
				<h1 style={{fontSize: '32px'}}>{title}</h1>
				<p>{description}</p>
			</Column>

			<img src={img} style={{maxWidth: '700px', objectFit: 'contain'}}/>
		</Row>
	)
}
