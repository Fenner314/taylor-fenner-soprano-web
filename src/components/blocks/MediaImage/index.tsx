import React from 'react'
import { urlForImage } from '../../../lib/sanity'
import './MediaImage.css'
import { parseCustomCSS } from '../../../utils/parseCustomCSS'

interface MediaImageProps {
	block: {
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
	}
	isInMediaGrid?: boolean
}

const MediaImage: React.FC<MediaImageProps> = ({
	block,
	isInMediaGrid = false,
}) => {
	const {
		title,
		image,
		alt,
		width,
		borderRadius = 0,
		description,
		organization,
		styles,
		backgroundColor,
		customCSS,
	} = block

	const containerStyle: React.CSSProperties = {
		...(width && { maxWidth: width, width: '100%' }),
		...(borderRadius > 0 && {
			borderRadius: `${borderRadius}px`,
			overflow: 'hidden',
		}),
		...(backgroundColor && { backgroundColor }),
		...(customCSS && { ...parseCustomCSS(customCSS) }),
	}

	const imageStyle: React.CSSProperties = {
		...(borderRadius > 0 && { borderRadius: `${borderRadius}px` }),
	}

	return (
		<div
			className={`media-image-container ${isInMediaGrid ? 'in-media-grid' : ''}`}
			style={containerStyle}
		>
			{image && (
				<img
					src={urlForImage(image).url()}
					alt={alt || title || 'Media image'}
					className={`media-image ${isInMediaGrid ? 'media-grid-image' : ''}`}
					style={imageStyle}
				/>
			)}
			{isInMediaGrid && (title || description || organization) && (
				<div className='media-image-content'>
					{title && <h3 className='media-image-title'>{title}</h3>}
					{description && <p className='media-image-description'>{description}</p>}
					{organization && (
						<p className='media-image-organization'>{organization}</p>
					)}
				</div>
			)}
		</div>
	)
}

export default MediaImage
