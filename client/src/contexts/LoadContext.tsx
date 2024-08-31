import { useContext, createContext, ReactNode} from 'react'

export interface LoadContext {
	loading: boolean | undefined
	errored: boolean | undefined
}

// Create context
const loadContext = createContext<LoadContext | undefined>(undefined)

interface Props {
	loading?: boolean
	errored?: boolean
	children: ReactNode
}
// Setup and export provider
export function LoadContextProvider({loading, errored, children}: Props): ReactNode {

	return (
		<loadContext.Provider value={{loading, errored}}>
			{children}
		</loadContext.Provider>
	)
}

// Export custom hook for using this context.
export default function useLoadContext() {
	return useContext(loadContext)
}

