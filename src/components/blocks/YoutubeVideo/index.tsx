import React from 'react'

interface YoutubeVideoProps {
	block: {
		_key?: string
		_id?: string
		_type: 'youtubeVideo'
		url: string
		aspectRatio?: string
		autoplay?: boolean
		loop?: boolean
		muted?: boolean
		showControls?: boolean
		title?: string
		label?: string
	}
}

const YoutubeVideo: React.FC<YoutubeVideoProps> = ({ block }) => {
	if (!block.url) return null
	const params = [
		block.autoplay ? 'autoplay=1' : 'autoplay=0',
		block.loop ? 'loop=1' : 'loop=0',
		block.muted ? 'mute=1' : 'mute=0',
		block.showControls === false ? 'controls=0' : 'controls=1',
	].join('&')
	const src = `${block.url.replace('watch?v=', 'embed/').split('&')[0]}?${params}`
	const aspect = block.aspectRatio || '16:9'
	const [w, h] = aspect.split(':').map(Number)
	const padding = h && w ? `${(h / w) * 100}%` : '56.25%'
	return (
		<div
			className='youtube-video-block'
			style={{ position: 'relative', width: '100%', paddingBottom: padding }}
			data-label={block.label}
		>
			<iframe
				src={src}
				title={block.title || 'YouTube Video'}
				frameBorder='0'
				allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
				allowFullScreen
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
				}}
			/>
		</div>
	)
}

export default YoutubeVideo
