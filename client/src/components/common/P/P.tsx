import CSSstyle from './P.module.css'
import { CSSProperties, ReactNode } from 'react'
interface Props {
	loading?: boolean
	children?: ReactNode
	style?: CSSProperties
}
export default function P({ loading, children, style }: Props) {

	if(loading) return (
		<div className={`${CSSstyle.p} loader`} style={style}/>
	)

	return (
		<p style={style}>{children}</p>
	)
}