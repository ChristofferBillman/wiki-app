import Skeleton from '../Skeleton'
import { Props } from './props'

export default function H1({ style, skeletonStyle, children, loading, errored }: Props) {
	return (
		<Skeleton
			style={{ minHeight: '3rem', minWidth: '50px', ...skeletonStyle}}
			loading={loading}
			errored={errored}
		>
			<h1 style={style}>{children}</h1>
		</Skeleton>
	)
}