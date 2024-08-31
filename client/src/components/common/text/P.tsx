import Skeleton from '../Skeleton'
import { Props } from './props'

export default function H1({ style, skeletonStyle, children, loading, errored }: Props) {
	return (
		<Skeleton
			style={{ minHeight: '1rem', minWidth: '200px', ...skeletonStyle}}
			loading={loading}
			errored={errored}
		>
			<p style={style}>{children}</p>
		</Skeleton>
	)
}