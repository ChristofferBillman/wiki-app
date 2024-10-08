import CSSStyle from './PageCard.module.css'

import { useLocation, useNavigate } from 'react-router-dom'

import Page from '../../types/Page'
import Card from '../common/Card'
import { Column } from '../common/Layout'
import PlaceholderImg from '../../assets/img/placeholder.jpg'
import { useMemo } from 'react'
import Skeleton from '../common/Skeleton'

interface Props {
    page?: Page
	loading?: boolean
}

export function PageCard({page, loading=false}: Props) {

	const navigate = useNavigate()
	const location = useLocation()

	if(loading || !page) return <PageCardSkeleton/>

	const {title, description} = useMemo(() => getTitleAndDescription(page), [page])

	return (
		<Card
			style={{width: '400px', maxWidth: '600px'}}
			onClick={() => navigate(location.pathname + '/page/' + page._id)}
		>
			<CardImage src={getImage(page)}/>
			<Column className='std-padd'>
				<h4>{title}</h4>
				<p>{description}</p>
			</Column>
		</Card>
	)
}

function PageCardSkeleton() {
	return (
		<Skeleton style={{borderRadius: '24px', width: '400px', maxWidth: '600px', height: '225px'}}>
			<Card/>
		</Skeleton>
	)
}

function getTitleAndDescription(page: Page): {title: string, description: string} {
	const markdown = page.content

	const lines = markdown.split(/\r?\n/)

	const title = lines[0].replace('#','')
	const description = lines[1]
	return {title, description}
}

function getImage(page: Page): string {
	const img = page.infoSection.data.find(stat => stat.type == 'image')?.value

	if(img == undefined) {
		return PlaceholderImg
	}
	return img
}

interface CardImageProps {
    src: string
}

function CardImage({src}: CardImageProps) {
	return <img alt='img' className={CSSStyle.image} src={src}/>
}
