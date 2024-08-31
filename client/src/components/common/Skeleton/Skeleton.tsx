import CSSstyle from './Skeleton.module.css'
import { CSSProperties, ReactNode } from 'react'
import useLoadContext from '../../../contexts/LoadContext'

interface Props {
	loading?: boolean
	errored?: boolean
	children?: ReactNode
	style?: CSSProperties
}

export default function Skeleton({ loading, errored, children, style }: Props) {

	const loadContext = useLoadContext()

	// Always prefer state passed in via props, and if it is abscent try to use state from context.
	const isLoading = loading ?? loadContext?.loading
	const isErrored = errored ?? loadContext?.errored

	const skeletonClass = isErrored ? 'errored' : isLoading ? 'loader' : ''

	if (isErrored || isLoading) {
		return (
			<div className={`${CSSstyle.skeleton} ${skeletonClass}`} style={style}>
				{children}
			</div>
		)
	}

	return children
}