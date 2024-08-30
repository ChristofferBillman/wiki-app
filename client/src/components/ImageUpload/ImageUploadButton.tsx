import { useState } from 'react'
import Button from '../common/Button'
import { Plus } from '../../assets/Icons'
import { ImageUploadModal } from './ImageUploadModal'

interface Props {
	onImgUploaded: (url: string) => void
	text?: string
	color?: string
	icon?: React.ReactElement
	outline?: boolean
}

export function ImageUploadButton({onImgUploaded, text, color, icon, outline}: Props) {

	const [isOpen, setIsOpen] = useState(false)

	const onImgUpload = (filename: string) => {
		setIsOpen(false)
		onImgUploaded(filename)
	}

	return (
		<>
			<Button
				text={text ? text : 'Upload Image'}
				color={color ? color : 'var(--primary)'}
				icon={icon ? icon : <Plus/>}
				outline={outline}
				onClick={() => setIsOpen(true)}
			/>
			
			<ImageUploadModal
				onImgUploaded={onImgUpload}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			/>
		</>
	)
}