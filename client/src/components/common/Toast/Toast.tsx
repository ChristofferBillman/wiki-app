import CSSstyle from './Toast.module.css'
import Card from '../Card'
import { ToastType } from '../../../contexts/ToastContext'
import { Info, Cross, Check } from '../../../assets/Icons'
import TransitionLifecycle from '../TransitionLifecycle'

interface Props {
	message: string
	type: ToastType
	visible: boolean
}

export function Toast({ message, type = 'info', visible }: Props) {
	return (
		<TransitionLifecycle
			willRender={visible}
			transition={{
				initial: { opacity: 0, transform: 'translateY(20px)' },
				transition: { opacity: 1, transform: 'translateY(0)' },
				exit: { opacity: 0, transform: 'translateY(20px)' },
				duration: 200
			}}
			style={{ position: 'fixed', bottom: '3rem', right: '3rem', background: 'var(--white)', borderRadius: '18px'}}
		>
			<Card className={`${getStyle(type)} ${CSSstyle.toast}`}>
				{getIcon(type)}
				<p>{message}</p>
			</Card>
		</TransitionLifecycle>
	)
}

function getStyle(type: ToastType): string {
	switch(type) {
	case 'info': return CSSstyle.info
	case 'error': return CSSstyle.error
	case 'success': return CSSstyle.success
	case 'warn': return CSSstyle.warn
	}
}

function getIcon(type: ToastType): JSX.Element {
	switch(type) {
	case 'info': return <Info color='var(--primary)'/>
	case 'error': return <Cross color='#ff4242'/>
	case 'success': return <Check color='#2e8a22'/>
	case 'warn': return <Info color='#ffc34c'/>
	}
}