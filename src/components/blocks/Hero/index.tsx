import React, { useEffect } from 'react'
import { urlForImage } from '../../../lib/sanity'
import './Hero.css'
import { usePagesContext } from '../../../contexts/PagesContext'

interface HeroProps {
	block: {
		_key?: string
		_id?: string
		_type: 'hero'
		title?: string
		text?: any
		image?: any
		label?: string
		parallax?: boolean
	}
}

const Hero: React.FC<HeroProps> = ({ block }) => {
	const { updateParallaxSectionPosition } = usePagesContext()

	useEffect(() => {
		setTimeout(() => {
			if (block.parallax && block._key) {
				const element = document.getElementById(block._key)

				if (element) {
					updateParallaxSectionPosition(block._key, element.offsetTop)
				}
			}
		})
	}, [block._key])

	return (
		<div
			key={block._key || block._id}
			id={block._key}
			className={`hero-section ${block.parallax ? 'parallax' : ''}`}
			data-page={block.label}
		>
			{block.image && !block.parallax && (
				<img
					src={urlForImage(block.image).url()}
					alt={block.title || 'Hero image'}
					className='hero-image'
				/>
			)}
			{block.text?.title && <h1 className='hero-title'>{block.text.title}</h1>}
		</div>
	)
}

export default Hero
