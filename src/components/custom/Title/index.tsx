import React from 'react'
import './Title.css'

interface TitleProps {
	children: React.ReactNode
}

const Title: React.FC<TitleProps> = ({ children }) => {
	return (
		<div className='title-container'>
			<h2 className='highlighted-title'>{children}</h2>
			<div className='underline'></div>
		</div>
	)
}

export default Title
