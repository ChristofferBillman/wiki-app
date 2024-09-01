
import { useNavigate } from 'react-router-dom'

import Card from '../common/Card'
import { Column } from '../common/Layout'
import PlaceholderImg from '../../assets/img/placeholder.jpg'

import Wiki from '../../types/Wiki'
import Skeleton from '../common/Skeleton'

interface Props {
    wiki?: Wiki
	loading?: boolean
	errored?: boolean
}

export function WikiCard({wiki, loading, errored}: Props) {

	const navigate = useNavigate()

	if(!wiki) return (
		<Skeleton loading={loading} errored={errored} style={{borderRadius: '24px'}}>
			<Card style={{width: '400px', maxWidth: '600px', height: '245px'}}/>
		</Skeleton>)

	return (
		<Card
			style={{width: '400px', maxWidth: '600px'}}
			onClick={() => navigate('/wiki/' + wiki.name)}
		>
			<CardImage src={getImage(wiki)}/>
			<Column className='std-padd'>
				<h4>{wiki.name}</h4>
				<p>{wiki.description}</p>
			</Column>
		</Card>
	)
}

function getImage(wiki: Wiki): string {
	const img = wiki.img

	if(img == undefined || img == '') {
		return PlaceholderImg
	}
	return '/api/uploads/' + img
}

interface CardImageProps {
    src: string
}

function CardImage({src}: CardImageProps) {
	return <img alt='img' style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '23px 23px 0 0'}} src={src}/>
}
