import React from 'react'
import renderBlock from '../../../utils/renderBlock'

interface GalleryProps {
	block: {
		_key?: string
		_id?: string
		_type: 'gallery'
		content?: any[]
		label?: string
		title?: string
	}
}

const Gallery: React.FC<GalleryProps> = ({ block }) => {
	const { content = [], label, title } = block
	return (
		<div className='gallery-block' data-label={label}>
			{title && <div className='gallery-title'>{title}</div>}
			<div className='gallery-content'>
				{content.map((child: any) => renderBlock(child, { isInMediaGrid: true }))}
			</div>
		</div>
	)
}

export default Gallery
