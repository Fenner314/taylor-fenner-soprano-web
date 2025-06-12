import React from 'react'
import './Title.css'

interface TitleProps {
	children: React.ReactNode
}

const Title: React.FC<TitleProps> = ({ children }) => {
	return (
		<div className='title-container' data-page={children}>
			<h1 className='highlighted-title'>{children}</h1>
			<div className='underline'></div>
		</div>
	)
}

export default Title
