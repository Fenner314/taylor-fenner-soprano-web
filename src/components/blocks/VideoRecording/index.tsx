import React from 'react'

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
	return (
		<div key={block._key || block._id} className='video-item'>
			<h3>
				<a
					href={block.videoUrl}
					className='video-link'
					target='_blank'
					rel='noopener noreferrer'
				>
					{block.title}
				</a>
			</h3>
			{block.description && <p>{block.description}</p>}
		</div>
	)
}

export default VideoRecording
