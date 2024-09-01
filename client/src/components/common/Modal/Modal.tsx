import { CSSProperties, Dispatch, SetStateAction, useRef } from 'react'
import CSSstyle from './Modal.module.css'

import TransitionLifecycle from '../TransitionLifecycle'
import Card from '../Card'

import useOutsideClick from '../../../hooks/useOutsideClick'

interface Props {
	style?: CSSProperties
	visible: boolean
    setVisible: Dispatch<SetStateAction<boolean>>
    children: JSX.Element | JSX.Element[]
}

export function Modal({ visible, setVisible, children, style}: Props) {

	const ref = useRef(null)
	useOutsideClick(ref, () => setVisible(false))

	return (
		<TransitionLifecycle
			willRender={visible}
			transition={{
				initial: { opacity: 0, transform: 'translateY(-20px)' },
				transition: { opacity: 1, transform: 'translateY(0)' },
				exit: { opacity: 0, transform: 'translateY(20px)' },
				duration: 200
			}}
			style={{zIndex: 1000, position: 'fixed', top:'50%', left:'50%'}}
		>
			<Card className={CSSstyle.modal} style={style} forwardRef={ref}>
				{children}
			</Card>
		</TransitionLifecycle>
	)
}