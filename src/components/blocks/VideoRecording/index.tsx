import React from 'react'
import './VideoRecording.css'

interface VideoRecordingProps {
	block: {
		_key?: string
		_id?: string
		_type: 'videoRecording'
		title: string
		description?: string
		videoUrl: string
	}
}

const VideoRecording: React.FC<VideoRecordingProps> = ({ block }) => {
	// Extract YouTube video ID from URL
	const getYouTubeId = (url: string) => {
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
		const match = url.match(regExp)
		return match && match[2].length === 11 ? match[2] : null
	}

	const videoId = getYouTubeId(block.videoUrl)

	if (!videoId) {
		console.warn('Invalid YouTube URL:', block.videoUrl)
		return (
			<div className='video-item error'>
				<p>Invalid YouTube URL</p>
			</div>
		)
	}

	return (
		<div className='video-item'>
			<div className='video-wrapper'>
				<iframe
					width='100%'
					height='100%'
					src={`https://www.youtube.com/embed/${videoId}`}
					title={block.title}
					frameBorder='0'
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
					allowFullScreen
				></iframe>
			</div>
			<h3 className='video-title'>{block.title}</h3>
			{block.description && (
				<p className='video-description'>{block.description}</p>
			)}
		</div>
	)
}

export default VideoRecording
