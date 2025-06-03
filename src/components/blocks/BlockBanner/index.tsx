import React from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '../../../utils/portableTextComponents'

interface BlockBannerProps {
	block: {
		_key?: string
		_id?: string
		_type: 'blockBanner'
		title?: string
		text?: {
			content: any[]
		}
		button?: {
			url: string
			text: string
			openInNewTab?: boolean
		}
	}
}

const BlockBanner: React.FC<BlockBannerProps> = ({ block }) => {
	return (
		<div key={block._key || block._id} className='cta-section'>
			{block.text?.content && (
				<div className='rich-text'>
					<PortableText
						value={block.text?.content}
						components={portableTextComponents}
					/>
				</div>
			)}
			{block.button && (
				<a
					href={block.button.url}
					className='cta-button'
					target={block.button.openInNewTab ? '_blank' : '_self'}
					rel={block.button.openInNewTab ? 'noopener noreferrer' : undefined}
				>
					{block.button.text}
				</a>
			)}
		</div>
	)
}

export default BlockBanner
