
import { useNavigate } from 'react-router-dom'

import Card from '../common/Card'
import { Column } from '../common/Layout'
import PlaceholderImg from '../../assets/img/placeholder.jpg'
import { useMemo } from 'react'

import Wiki from '../../types/wiki'

interface Props {
    wiki: Wiki
}

export function WikiCard({wiki}: Props) {

	const navigate = useNavigate()

	const {title, description} = useMemo(() => getTitleAndDescription(wiki), [wiki])

	return (
		<Card
			style={{width: '400px', maxWidth: '600px'}}
			onClick={() => navigate('/wiki/' + wiki._id)}
		>
			<CardImage src={getImage(wiki)}/>
			<Column>
				<h4>{title}</h4>
				<p>{description}</p>
			</Column>
		</Card>
	)
}

function getTitleAndDescription(wiki: Wiki): {title: string, description: string} {
	const markdown = wiki.description

	const lines = markdown.split(/\r?\n/)

	const title = lines[0].replace('#','')
	const description = lines[1]
	return {title, description}
}

function getImage(wiki: Wiki): string {
	const img = wiki.img

	if(img == undefined) {
		return PlaceholderImg
	}
	return img
}

interface CardImageProps {
    src: string
}

function CardImage({src}: CardImageProps) {
	return <img alt='img' src={src}/>
}
