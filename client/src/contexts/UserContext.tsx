import { useContext, Dispatch, SetStateAction, createContext} from 'react'
import User from '../types/User'
import useLocalStorage from '../hooks/useLocalStorage'

interface UserContext {
	user: User | undefined
	setUser: Dispatch<SetStateAction<User | undefined>>
	reset: () => void
}

// Create context
const userContext = createContext<UserContext>({
	user: undefined,
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

	const [user, setUser] = useLocalStorage('user', undefined)

	const reset = () => {
		localStorage.removeItem('user')
		document.cookie = 'token' + '=; Max-Age=-99999999;'
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

