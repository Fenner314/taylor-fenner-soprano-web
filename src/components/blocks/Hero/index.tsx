import React from 'react'
import { PortableText } from '@portabletext/react'
import { urlForImage } from '../../../lib/sanity'
import { portableTextComponents } from '../../../utils/portableTextComponents'
import './Hero.css'

interface HeroProps {
	block: {
		_key?: string
		_id?: string
		_type: 'hero'
		title?: string
		text?: any
		image?: any
	}
}

const Hero: React.FC<HeroProps> = ({ block }) => {
	return (
		<div key={block._key || block._id} className='hero-section'>
			{block.image && (
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
