import style from './MenuItem.module.css'
import { Column, Row } from '../common/Layout'
import H4 from '../common/text/H4'
import H5 from '../common/text/H5'

interface Props {
	title: string
	description: string
	children: JSX.Element | JSX.Element[]
}
export function MenuItem({ title, description, children }: Props) {
	return (
		<Row className={style.row}>
			<Column className={style.textContainer}>
				<H4>{title}</H4>
				<H5>{description}</H5>
			</Column>
			<Row style={{ alignItems: 'center' }}>
				{children}
			</Row>
		</Row>
	)
}