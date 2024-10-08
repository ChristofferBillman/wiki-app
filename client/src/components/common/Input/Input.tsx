import { CSSProperties, ForwardedRef, forwardRef } from 'react'
import CSSstyle from './Input.module.css'

interface Props {
    placeholder?: string
    style?: CSSProperties
	value: string
	setValue: (arg0: React.ChangeEvent<HTMLInputElement>) => void
	name: string
	type?: string
	onFocus?: () => void
	onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input = forwardRef(function Input({placeholder, value, setValue, name, type, style, onFocus, onBlur}: Props, ref: ForwardedRef<HTMLInputElement>) {
	return (
		<input
			onFocus={onFocus}
			onBlur={onBlur}
			style={style}
			type={type}
			className={CSSstyle.input}
			placeholder={placeholder}
			value={value}
			name={name}
			onChange={e => setValue(e)}
			ref={ref}
		/>
	)
})
