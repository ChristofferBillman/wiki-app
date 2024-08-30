import { ChangeEvent, useRef } from 'react'

import CSSStyle from './Textarea.module.css'
import InputStyle from '../Input/Input.module.css'

import useAutosizeTextArea from '../../../hooks/useAutosizeTextarea'

interface Props {
	value: string
	onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
    rows: number
    placeholder: string
    name: string
}

export function Textarea({ value, onChange, rows, placeholder, name }: Props) {
	const textAreaRef = useRef<HTMLTextAreaElement>(null)
  
	useAutosizeTextArea(textAreaRef.current, value)

	return (
		<textarea
			className={`${InputStyle.input} ${CSSStyle.editor}`}
			onChange={onChange}
			ref={textAreaRef}
			rows={rows}
			value={value}
			placeholder={placeholder}
			name={name}
		/>
	)
}