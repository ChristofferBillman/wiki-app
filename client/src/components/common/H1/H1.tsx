import CSSstyle from './H1.module.css'
import { CSSProperties, ReactNode } from 'react'
interface Props {
	loading?: boolean
	children?: ReactNode
	style?: CSSProperties
}
export default function H1({ loading, children, style }: Props) {

	if(loading) return (
		<div className={`${CSSstyle.h1Skeleton} loader`} style={style}/>
	)

	return (
		<h1 style={style}>{children}</h1>
	)
}