import React, { useEffect, useRef } from 'react'
import { urlForImage } from '../../../lib/sanity'
import './MediaImage.css'

interface MediaImageProps {
	block: {
		_key?: string
		_id?: string
		_type: string
		title: string
		image: {
			asset: {
				_ref: string
				_type: string
				url: string
			}
		}
		styles?: string
		description?: string
		organization?: string
		role?: string
		year?: string
		director?: string
		conductor?: string
		photographer?: string
	}
	isLast?: boolean
	totalGridSpacesBefore?: number
	onGridSpacesChange?: (spaces: number) => void
}

const MediaImage: React.FC<MediaImageProps> = ({
	block,
	isLast,
	totalGridSpacesBefore = 0,
	onGridSpacesChange,
}) => {
	const imageRef = useRef<HTMLImageElement>(null)
	const [aspectRatio, setAspectRatio] = React.useState<
		'square' | 'portrait' | 'landscape'
	>('square')

	// Parse custom styles
	const customStyles = React.useMemo(() => {
		if (!block.styles) return {}
		try {
			return JSON.parse(block.styles)
		} catch (err) {
			console.warn('Failed to parse custom styles:', err)
			return {}
		}
	}, [block.styles])

	// Calculate grid spaces needed for this image
	const getGridSpaces = (ratio: 'square' | 'portrait' | 'landscape'): number => {
		switch (ratio) {
			case 'landscape':
				return 2 // Takes 2 columns
			case 'portrait':
				return 1 // Takes 1 grid space
			case 'square':
			default:
				return 1
		}
	}

	useEffect(() => {
		const determineAspectRatio = () => {
			const img = imageRef.current
			if (!img) return

			const ratio = img.naturalWidth / img.naturalHeight

			// Calculate natural aspect ratio
			let naturalAspectRatio: 'square' | 'portrait' | 'landscape' = 'square'
			if (ratio > 1.3) {
				naturalAspectRatio = 'landscape'
			} else if (ratio < 0.7) {
				naturalAspectRatio = 'portrait'
			}

			// If it's the last image and it's landscape, check if it would create a gap
			if (isLast && naturalAspectRatio === 'landscape') {
				const totalSpacesTaken = totalGridSpacesBefore
				// If we're starting on the second column, make it square to avoid gap
				const shouldMakeSquare = totalSpacesTaken % 2 === 1
				const finalAspectRatio = shouldMakeSquare ? 'square' : 'landscape'
				setAspectRatio(finalAspectRatio)
				onGridSpacesChange?.(getGridSpaces(finalAspectRatio))
			} else {
				setAspectRatio(naturalAspectRatio)
				onGridSpacesChange?.(getGridSpaces(naturalAspectRatio))
			}
		}

		const img = imageRef.current
		if (img?.complete) {
			determineAspectRatio()
		} else if (img) {
			img.onload = determineAspectRatio
		}
	}, [block.image, isLast, totalGridSpacesBefore, onGridSpacesChange])

	if (!block.image?.asset) {
		console.warn('No image data found for block:', block)
		return null
	}

	return (
		<div
			key={block._key || block._id}
			className={`media-item ${aspectRatio}`}
			style={{
				gridColumn: aspectRatio === 'landscape' ? 'span 2' : 'span 1',
				gridRow: aspectRatio === 'portrait' ? 'span 2' : 'span 1',
			}}
		>
			<div className='media-image-wrapper'>
				<img
					ref={imageRef}
					src={urlForImage(block.image).url()}
					alt={block.title}
					className='media-image'
					style={{
						...customStyles,
					}}
				/>
				<div className='media-overlay'>
					<div className='media-content'>
						<h3 className='media-title'>{block.title}</h3>
						{block.role && <p className='media-role'>{block.role}</p>}
						{block.description && <p className='media-role'>{block.description}</p>}
						{block.organization && (
							<p className='media-organization'>{block.organization}</p>
						)}
						{block.year && <p className='media-year'>{block.year}</p>}
						{(block.director || block.conductor || block.photographer) && (
							<div className='media-credits'>
								{block.director && <p>Director: {block.director}</p>}
								{block.conductor && <p>Conductor: {block.conductor}</p>}
								{block.photographer && <p>Photographer: {block.photographer}</p>}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default MediaImage
