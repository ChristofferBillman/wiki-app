import { useState } from 'react'
import Button from '../common/Button'
import { Plus } from '../../assets/Icons'
import { ImageUploadModal } from './ImageUploadModal'

interface Props {
	onImgUploaded: (url: string) => void
}

export function ImageUploadButton({onImgUploaded}: Props) {

	const [isOpen, setIsOpen] = useState(false)

	const onImgUpload = (filename: string) => {
		setIsOpen(false)
		onImgUploaded(filename)
	}

	return (
		<>
			<Button
				text='Upload Image'
				color='var(--primary)'
				icon={<Plus/>}
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