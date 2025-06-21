import React from 'react'
import './Title.css'
import { BlockBase } from '../../../types/sanity'

interface TitleBlock extends BlockBase {
	text?: string
	level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
	alignment?: 'left' | 'center' | 'right'
	color?: string
	styles?: {
		[key: string]: string | number
	}
}

interface TitleProps {
	block?: TitleBlock
	children?: React.ReactNode
}

const Title: React.FC<TitleProps> = ({ block, children }) => {
	return (
		<div
			className='title-container'
			data-page={children}
			data-label={block?.label}
		>
			<h2 className='title' style={{ color: block?.color }}>
				{children ?? block?.text}
			</h2>
		</div>
	)
}

export default Title
