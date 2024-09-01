import { CSSProperties } from 'react'
import { Row } from '../Layout'
import Button from '../Button'
import Modal from '../Modal'

interface Props {
	style?: CSSProperties
	prompt: string
	text?: string
	confirmText?: string
	cancelText?: string
	onCancel: () => void
	onConfirm: () => void
	visible: boolean
}

export function ConfirmationModal({ prompt, onCancel, onConfirm, visible, text, cancelText, confirmText}: Props) {

	return (
		<Modal visible={visible} setVisible={onCancel}>
			<h2 style={{marginBottom: '2rem'}}>{prompt}</h2>
			<h5 style={{marginBottom: '2rem', width: '80%', alignSelf: 'center'}}>{text}</h5>
		
			<Row style={{justifyContent: 'space-around'}}>
				<Button outline text={cancelText ? cancelText : 'Cancel'} onClick={onCancel}/>
				
				<Button color='var(--red)' text={confirmText ? confirmText : 'Confirm'} onClick={onConfirm}/>
			</Row>
		</Modal>
	)
}