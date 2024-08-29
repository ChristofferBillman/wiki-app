import { SetStateAction, useRef, useState } from 'react'
import Card from '../common/Card'
import { Column, Filler, Row } from '../common/Layout'
import useOutsideClick from '../../hooks/useOutsideClick'

import CSSstyle from '../common/ConfirmationModal/Modal.module.css'
import Button from '../common/Button'
import Input from '../common/Input'
import { Floppy } from '../../assets/Icons'
import FileAPI from '../../network/FileAPI'
import useToast from '../../contexts/ToastContext'
import TransitionLifecycle from '../common/TransitionLifecycle'

interface Props {
	isOpen: boolean
	setIsOpen: React.Dispatch<SetStateAction<boolean>>
	onImgUploaded: (url: string) => void
}

export function ImageUploadModal({ isOpen, setIsOpen, onImgUploaded }: Props) {

	const ref = useRef(null)
	const filePickerRef = useRef(null)

	useOutsideClick(ref, () => setIsOpen(false))
	const toast = useToast()

	const [value, setValue] = useState('')

	const handleUpload = () => {
		FileAPI.upload(filePickerRef,
			res => onImgUploaded(res.filename),
			err => toast(err, 'error'))
	}

	return (
		<TransitionLifecycle
			willRender={isOpen}
			transition={{
				initial: { opacity: 0, transform: 'translateY(-20px)' },
				transition: { opacity: 1, transform: 'translateY(0)' },
				exit: { opacity: 0, transform: 'translateY(20px)' },
				duration: 200
			}}
			style={{zIndex: 1000, position: 'fixed', top:'50%', left:'50%'}}
		>
			<div ref={ref}>
				<Card className={CSSstyle.modal}>
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
				</Card>
			</div>
		</TransitionLifecycle>
	)
}