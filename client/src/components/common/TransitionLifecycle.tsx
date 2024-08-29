import React, { CSSProperties, useEffect, useState } from 'react'

interface Props {
	children: React.ReactNode
	willRender: boolean
	transition: Transition
	style?: CSSProperties
	id?: string
}
export interface Transition {
	initial: CSSProperties
	transition: CSSProperties
	exit: CSSProperties
	duration: number
}
/**
 * TransitionLifecycle transitions between mount / unmount of its child components.
 * 
 * Props:
 * - children: the child component(s) to be transitioned
 * - willRender: the condition to determine if the child component(s) will be rendered
 * - transition: the transition properties to be applied to the child component(s)
 * 
 * Example:
 * 
 * <TransitionLifecycle
 *		willRender={true or false}
 *		transition={{
 *			initial: { opacity: 0, transform: 'translateY(-50px)' },
 *			transition: { opacity: 1, transform: 'translateY(0)' },
 *			exit: { opacity: 0, transform: 'translateY(50px)' },
 *			duration: 1000
 *		}}
 *	>
 *		<h1>Hello World</h1>
 *	</TransitionLifecycle>
 */
export default function TransitionLifecycle({ children, transition, willRender, style, id }: Props): JSX.Element {

	const [childrenMounted, setChildrenMounted] = useState<boolean>(false)
	const [transitioning, setTransitioning] = useState<boolean>(false)

	useEffect(() => {
		let timer1: ReturnType<typeof setTimeout>, timer2: ReturnType<typeof setTimeout>

		if (transitioning) return
		if (willRender) {
			setChildrenMounted(true)
			setTransitioning(true)
			timer1 = setTimeout(() => {
				setTransitioning(false)
			}, transition.duration)
		} else {
			setTransitioning(true)
			timer2 = setTimeout(() => {
				setChildrenMounted(false)
				setTransitioning(false)
			}, transition.duration)
		}
		return () => {
			clearTimeout(timer1)
			clearTimeout(timer2)
		}
	}, [willRender, transition.duration])

	const getCurrentStyle = (): CSSProperties => {
		const transitionDuration: CSSProperties = { transitionDuration: transition.duration + 'ms' }

		if (!childrenMounted)
			return { ...transition.initial, ...transitionDuration }

		if (willRender)
			return { ...(transition.transition), ...transitionDuration }

		else
			return { ...(transition.exit), ...transitionDuration }
	}

	return (
		<div style={{...getCurrentStyle(), ...style}} id={id}>
			{childrenMounted ? children : null}
		</div>
	)
}