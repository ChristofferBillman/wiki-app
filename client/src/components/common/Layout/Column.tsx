import CSSstyle from './Layout.module.css'

interface Props {
    children?: JSX.Element[] | JSX.Element
    style?: React.CSSProperties
	className?: string
    padding?: boolean
	loading?: boolean
}

export function Column({children, style, className, loading}: Props) {

	if(loading) return (
		<div className={`${CSSstyle.column} ${CSSstyle.loading} loader ${className}`} style={style}/>
	)
	return (
		<div className={`${CSSstyle.column} ${className}`} style={style}>
			{children}
		</div>
	)
}
