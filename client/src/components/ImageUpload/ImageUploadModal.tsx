import { SetStateAction, useRef, useState } from 'react'
import { Column, Filler, Row } from '../common/Layout'
import Button from '../common/Button'
import Input from '../common/Input'
import { Floppy } from '../../assets/Icons'
import FileAPI from '../../network/FileAPI'
import useToast from '../../contexts/ToastContext'
import Modal from '../common/Modal'

interface Props {
	isOpen: boolean
	setIsOpen: React.Dispatch<SetStateAction<boolean>>
	onImgUploaded: (url: string) => void
}

export function ImageUploadModal({ isOpen, setIsOpen, onImgUploaded }: Props) {
	
	const filePickerRef = useRef(null)

	const toast = useToast()

	const [value, setValue] = useState('')

	const handleUpload = () => {
		FileAPI.upload(filePickerRef,
			res => onImgUploaded(res.filename),
			err => toast(err, 'error'))
	}

	return (
		<Modal visible={isOpen} setVisible={setIsOpen}>
			<Column>
				<Filler />
				<h1>Upload image</h1>

				<Input
					value={value}
					setValue={e => setValue(e.target.value)}
					type='file'
					name='filepicker'
					ref={filePickerRef}
				/>
				<Row style={{padding: 0}}>
					<Button
						text='Cancel'
						color='var(--white)'
						outline
						onClick={() => setIsOpen(false)}
					/>

					<Button
						text='Upload'
						color='var(--primary)'
						outline
						icon={<Floppy/>}
						onClick={handleUpload}
					/>
				</Row>
			</Column>
		</Modal>
	)
}