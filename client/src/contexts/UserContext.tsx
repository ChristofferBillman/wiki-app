import { useContext, Dispatch, SetStateAction, createContext} from 'react'

import useLocalStorage from '../hooks/useLocalStorage'

interface UserContext {
	user: any
	setUser: Dispatch<SetStateAction<any>>
	reset: () => void
}

// Create context
const userContext = createContext<UserContext>({
	user: {_id: 'NOID', name: 'no_name'},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setUser: () => {},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	reset: () => {}
})

interface Props {
	children: JSX.Element[] | JSX.Element
}
// Setup and export provider
export function UserContextProvider({children}: Props): JSX.Element {

	const [user, setUser] = useLocalStorage('user','unset')

	const reset = () => {
		localStorage.removeItem('user')
		localStorage.removeItem('token')
	}

	return (
		<userContext.Provider value={{user, setUser, reset}}>
			{children}
		</userContext.Provider>
	)
}

// Export custom hook for using this context.
export default function useUser() {
	return useContext(userContext)
}

