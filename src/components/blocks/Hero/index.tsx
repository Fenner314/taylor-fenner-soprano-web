import React from 'react'
import { PortableText } from '@portabletext/react'
import { urlForImage } from '../../../lib/sanity'
import { portableTextComponents } from '../../../utils/portableTextComponents'

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
		<div
			key={block._key || block._id}
			className='hero-section'
			style={{ margin: '2rem 0' }}
		>
			{block.image && (
				<img
					src={urlForImage(block.image).url()}
					alt={block.title || 'Hero image'}
					style={{
						width: '100%',
						height: '300px',
						objectFit: 'cover',
						borderRadius: '12px',
					}}
				/>
			)}
			{block.text?.title && <h1>{block.text.title}</h1>}
		</div>
	)
}

export default Hero
