import Skeleton from '../Skeleton'
import style from './Button.module.css'

interface Props {
	text?: string
	icon?: JSX.Element
	color?: string
	outline?: boolean
	textColor?: string
	onClick?: () => void
	loading?: boolean
	errored?: boolean
	className?: string
	disabled?: boolean
}

export function Button({ icon, text, textColor, color = 'var(--white)', outline = false, onClick, loading, className, errored, disabled }: Props) {

	const outlineStyle = outline ? style.outline : ''

	const textColorStyle = color == 'var(--white)' ? style.darktext : style.lighttext

	return (
		<Skeleton loading={loading} errored={errored}>
			<button
				className={`${style.btn} ${outlineStyle} ${className}`}
				style={{ background: color }}
				onClick={() => !disabled && onClick && onClick()}
			>
				{icon}

				{text &&
					<span className={`${style.text} ${textColorStyle}`} style={{color: textColor}}>
						{text}
					</span>}
			</button>
		</Skeleton>
	)
}