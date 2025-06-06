import React from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '../../../utils/portableTextComponents'

interface BlockContentProps {
	block: {
		_key?: string
		_id?: string
		_type: 'blockContent'
		title?: string
		content?: any[]
	}
}

const BlockContent: React.FC<BlockContentProps> = ({ block }) => {
	return (
		<div
			key={block._key || block._id}
			className='content-section'
			data-content-type={block.title?.toLowerCase().replace(/\s+/g, '-')}
		>
			{/* {block.title && <h2 className='section-title'>{block.title}</h2>} */}
			{block.content && (
				<div className='rich-text'>
					<PortableText value={block.content} components={portableTextComponents} />
				</div>
			)}
		</div>
	)
}

export default BlockContent
