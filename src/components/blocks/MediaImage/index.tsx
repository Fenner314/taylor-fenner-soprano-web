import React from 'react'
import { urlForImage } from '../../../lib/sanity'

interface MediaImageProps {
	block: {
		_key?: string
		_id?: string
		_type: 'mediaImage'
		title: string
		image?: any
		description?: string
		organization?: string
	}
}

const MediaImage: React.FC<MediaImageProps> = ({ block }) => {
	return (
		<div key={block._key || block._id} className='media-item'>
			{block.image && (
				<img
					src={urlForImage(block.image).url()}
					alt={block.title}
					className='media-image'
				/>
			)}
			<div className='media-content'>
				<h3 className='media-title'>{block.title}</h3>
				{block.description && (
					<p className='media-description'>{block.description}</p>
				)}
				{block.organization && (
					<p className='media-organization'>{block.organization}</p>
				)}
			</div>
		</div>
	)
}

export default MediaImage
