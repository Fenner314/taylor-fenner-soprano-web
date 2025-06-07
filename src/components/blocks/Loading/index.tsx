import React from 'react'
import './Loading.css'

interface LoadingProps {
	size?: 'small' | 'medium' | 'large'
	text?: string
	fullscreen?: boolean
}

const Loading: React.FC<LoadingProps> = ({
	size = 'medium',
	text = 'Loading...',
	fullscreen = false,
}) => {
	return (
		<div className={`loading-container ${fullscreen ? 'fullscreen' : ''}`}>
			<div className={`loading-spinner ${size}`}>
				<div className='spinner'></div>
			</div>
			{text && <p className='loading-text'>{text}</p>}
		</div>
	)
}

export default Loading
