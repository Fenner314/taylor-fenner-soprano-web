import React, { useRef, useEffect } from 'react'
import MediaImage from '../MediaImage'
import './MediaGrid.css'

interface MediaGridProps {
	block: {
		_key?: string
		_id?: string
		_type: 'mediaGrid'
		title?: string
		images: Array<{
			_key: string
			_type: string
			title: string
			image: {
				asset: {
					_ref: string
					_type: string
					url: string
				}
			}
			description?: string
			organization?: string
			role?: string
			year?: string
			director?: string
			conductor?: string
			photographer?: string
		}>
	}
}

const MediaGrid: React.FC<MediaGridProps> = ({ block }) => {
	const gridSpacesRef = useRef<number[]>([])

	console.log('MediaGrid block:', block)

	if (!block.images?.length) {
		console.warn('No images found in MediaGrid block')
		return null
	}

	// Function to update grid spaces taken by an image
	const updateGridSpaces = (index: number, gridSpaces: number) => {
		gridSpacesRef.current[index] = gridSpaces
		console.log('Grid spaces updated:', gridSpacesRef.current)
	}

	// Calculate total grid spaces taken before an index
	const getTotalGridSpacesBefore = (index: number) => {
		return gridSpacesRef.current
			.slice(0, index)
			.reduce((sum, spaces) => sum + (spaces || 0), 0)
	}

	return (
		<div className='media-grid'>
			{block.images.map((image, index) => (
				<MediaImage
					key={image._key || `image-${index}`}
					block={image}
					isLast={index === block.images.length - 1}
					totalGridSpacesBefore={getTotalGridSpacesBefore(index)}
					onGridSpacesChange={(spaces) => updateGridSpaces(index, spaces)}
				/>
			))}
		</div>
	)
}

export default MediaGrid
