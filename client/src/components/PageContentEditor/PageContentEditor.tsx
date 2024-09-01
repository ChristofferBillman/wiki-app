import { Dispatch } from 'react'

import CSSStyle from './PageContentEditor.module.css'

import useAutosizeTextArea from '../../hooks/useAutosizeTextarea'
import Page from '../../types/Page'

import { PageReducerAction, PageReducerType } from '../../reducers/PageReducer'
import { Row } from '../common/Layout'
import Button from '../common/Button'
import { Plus } from '../../assets/Icons'
import useFocus from '../../hooks/useFocus'

interface Props {
	page: Page,
	dispatch: Dispatch<PageReducerAction>
}

export function PageContentEditor({ page, dispatch }: Props) {
	const [textAreaRef, setTextareaFocus] = useFocus<HTMLTextAreaElement>()

	useAutosizeTextArea(textAreaRef.current, page.content)

	const handleAdd = (contentToAdd: string) => {
		setTextareaFocus()
		dispatch({type: PageReducerType.SET_CONTENT, payload: page.content + contentToAdd})
	}

	return (
		<>
			<textarea
				className={CSSStyle.editor}
				onChange={e => dispatch({type: PageReducerType.SET_CONTENT, payload: e.target?.value})}
				ref={textAreaRef}
				rows={2}
				value={page.content}
				placeholder='Click here and start typing to add content...'
			/>

			<Row style={{justifyContent: 'center', marginTop: '2rem'}}>
				<Button
					outline
					text='Section'
					icon={<Plus color='var(--black)'/>}
					onClick={() => handleAdd('\n# ')}
				/>

				<Button
					outline
					text='Link'
					icon={<Plus color='var(--black)'/>}
					onClick={() => handleAdd('\n[Link Text](url)')}
				/>

				<Button
					outline
					text='Image'
					icon={<Plus color='var(--black)'/>}
					onClick={() => handleAdd('\n![Alt text](Image Url)')}
				/>
			</Row>
		</>
	)
}
