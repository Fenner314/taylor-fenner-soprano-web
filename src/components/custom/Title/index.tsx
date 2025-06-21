import React from 'react'
import './Title.css'
import { BlockBase } from '../../../types/sanity'

interface TitleProps {
	block?: BlockBase
	children: React.ReactNode
}

const Title: React.FC<TitleProps> = ({ block, children }) => {
	return (
		<div
			className='title-container'
			data-page={children}
			data-label={block?.label}
		>
			<h1 className='highlighted-title'>{children}</h1>
			<div className='underline'></div>
		</div>
	)
}

export default Title
