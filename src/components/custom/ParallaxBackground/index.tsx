import React from 'react'
import { urlForImage } from '../../../lib/sanity'
import './ParallaxBackground.css'

interface ParallaxBackgroundProps {
	block: any // Your Sanity block type
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ block }) => {
	// Extract background image from your Sanity block structure
	const backgroundImage = urlForImage(block.image).url()

	return (
		<div
			className='parallax-bg'
			style={{
				height: '100vh',
				width: '100%',
				backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
				backgroundColor: block.backgroundColor || '#1a1a2e',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
			}}
		>
			{/* Add any overlay effects or additional styling here */}
			{block.overlay && (
				<div
					className='parallax-overlay'
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: `rgba(0, 0, 0, ${block.overlay.opacity || 0.4})`,
					}}
				/>
			)}
		</div>
	)
}

export default ParallaxBackground
