import CSSstyle from './Layout.module.css'

interface Props {
    children?: JSX.Element[] | JSX.Element
    style?: React.CSSProperties
	className?: string
    padding?: boolean
	loading?: boolean
}

export function Column({children, style, padding = true, className, loading}: Props) {

	const paddingStyle = padding ? CSSstyle.defaultPadding : ''

	if(loading) return (
		<div className={`${CSSstyle.column} ${paddingStyle} ${CSSstyle.loading} loader`} style={style}/>
	)
	return (
		<div className={`${CSSstyle.column} ${paddingStyle} ${className}`} style={style}>
			{children}
		</div>
	)
}
