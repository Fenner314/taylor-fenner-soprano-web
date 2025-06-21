import React, { useState, useEffect } from 'react'
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
	const [gridSpaces, setGridSpaces] = useState<number[]>([])

	// Reset grid spaces when images change
	useEffect(() => {
		setGridSpaces(new Array(block.images?.length || 0).fill(1))
	}, [block.images])

	if (!block.images?.length) {
		console.warn('No images found in MediaGrid block')
		return null
	}

	// Function to update grid spaces taken by an image
	const updateGridSpaces = (index: number, spaces: number) => {
		setGridSpaces((current) => {
			const newSpaces = [...current]
			newSpaces[index] = spaces
			return newSpaces
		})
	}

	// Calculate total grid spaces taken before an index
	const getTotalGridSpacesBefore = (index: number) => {
		return gridSpaces
			.slice(0, index)
			.reduce((sum, spaces) => sum + (spaces || 1), 0)
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
