import Skeleton from '../Skeleton'
import { Props } from './props'

export default function H5({ style, skeletonStyle, children, loading, errored }: Props) {
	return (
		<Skeleton
			style={{ minHeight: '1rem', minWidth: '50px', ...skeletonStyle }}
			loading={loading}
			errored={errored}
		>
			<h5 style={style}>{children}</h5>
		</Skeleton>
	)
}