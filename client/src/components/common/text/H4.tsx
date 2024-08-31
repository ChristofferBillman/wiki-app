import Skeleton from '../Skeleton'
import { Props } from './props'

export default function H4({ style, skeletonStyle, children, loading, errored }: Props) {
	return (
		<Skeleton
			style={{ minHeight: '1.20rem', minWidth: '50px', ...skeletonStyle}}
			loading={loading}
			errored={errored}
		>
			<h4 style={style}>{children}</h4>
		</Skeleton>
	)
}