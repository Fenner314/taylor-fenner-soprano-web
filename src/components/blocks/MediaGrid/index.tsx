import React from 'react'
import MediaImage from '../MediaImage'
import './MediaGrid.css'

interface MediaGridProps {
	block: {
		_key?: string
		_id?: string
		_type: 'mediaGrid'
		title?: string
		images: Array<{
			_key?: string
			_id?: string
			_type: 'mediaImage'
			title?: string
			image?: any
			alt?: string
			width?: string
			borderRadius?: number
			description?: string
			organization?: string
			styles?: any
			backgroundColor?: string
			customCSS?: string
		}>
	}
}

const MediaGrid: React.FC<MediaGridProps> = ({ block }) => {
	if (!block.images?.length) {
		console.warn('No images found in MediaGrid block')
		return null
	}

	return (
		<div className='media-grid'>
			{block.images.map((image, index) => (
				<MediaImage
					key={image._key || `image-${index}`}
					block={image}
					isInMediaGrid={true}
				/>
			))}
		</div>
	)
}

export default MediaGrid
