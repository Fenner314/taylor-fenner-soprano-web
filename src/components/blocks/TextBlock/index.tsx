import React from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '../../../utils/portableTextComponents'

interface TextBlockProps {
	block: {
		_key?: string
		_id?: string
		_type: 'textBlock'
		alignment?: 'left' | 'center' | 'right'
		maxWidth?: string
		label?: string
		content: {
			_type: 'blockContent'
			content: any[]
		}
	}
}

const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
	const { alignment = 'left', maxWidth = '100%', label, content } = block
	return (
		<div
			className={`text-block align-${alignment}`}
			style={{ maxWidth }}
			data-label={label}
		>
			{content?.content && (
				<div className='rich-text'>
					<PortableText
						value={content.content}
						components={portableTextComponents}
					/>
				</div>
			)}
		</div>
	)
}

export default TextBlock
