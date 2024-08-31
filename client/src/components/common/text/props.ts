import { CSSProperties, ReactNode } from 'react'

export interface Props {
	loading?: boolean
	errored?: boolean
	children?: ReactNode
	style?: CSSProperties
	skeletonStyle?: CSSProperties
}