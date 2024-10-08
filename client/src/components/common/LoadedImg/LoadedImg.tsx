import { CSSProperties, ReactNode, useState } from 'react'

interface Props {
	src: string
	imgStyle: CSSProperties
	style: CSSProperties
	alt?: string
}

export function LoadedImg({ src, imgStyle, style, alt }: Props): ReactNode {

	const [loading, setLoading] = useState(true)
	const [errored, setErrored] = useState(false)

	if(errored) return (
		<div className='errored' style={{display: loading ? 'block' : 'none', height: '100%', width: '100%'}}/>
	)

	return (
		<div style={{height: '100%', width: '100%', ...style}}>
			<img
				src={src}
				alt={alt}
				style={{...{display: loading ? 'none' : 'block', width: '100%'}, ...imgStyle}}
				onLoad={() => setLoading(false)}
				onError={() => setErrored(true)}
			/>
			<div className='loader' style={{display: loading ? 'block' : 'none', height: '100%', width: '100%'}}/>
		</div>
	)
}