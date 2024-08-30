import { useState, useContext, createContext } from 'react'
import Toast from '../components/common/Toast'

export type ToastType = 'success' | 'error' | 'warn' | 'info'
// Create context
// eslint-disable-next-line 
const toastContext = createContext((_message: string, _type: ToastType) => { })

interface Props {
	children: JSX.Element[] | JSX.Element
}
// Setup and export provider
export function ToastContextProvider({ children }: Props): JSX.Element {

	const [visible, setVisible] = useState(false)
	const [message, setMessage] = useState('')
	const [type, setType] = useState<ToastType>('info')

	const setToast = (message: string, type: ToastType) => {
		setType(type)
		setMessage(message)
		setVisible(true)

		setTimeout(() => setVisible(false), 5000)
	}

	return (
		<toastContext.Provider value={setToast}>
			<Toast
				message={message}
				type={type}
				visible={visible}
			/>
			{children}
		</toastContext.Provider>
	)
}

// Export custom hook for using this context.
export default function useToast() {
	return useContext(toastContext)
}

