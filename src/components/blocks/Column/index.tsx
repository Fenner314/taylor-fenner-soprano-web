import React from 'react'
import renderBlock from '../../../utils/renderBlock'

interface ColumnProps {
	block: {
		_key?: string
		_id?: string
		_type: 'column'
		content?: any[]
		alignment?: 'left' | 'center' | 'right'
		width?: string
		padding?: string
		label?: string
		title?: string
	}
}

const Column: React.FC<ColumnProps> = ({ block }) => {
	const {
		content = [],
		alignment = 'left',
		width = 'auto',
		padding = '0',
		label,
	} = block

	// Handle width for flex layout
	const getColumnStyle = () => {
		const baseStyle: React.CSSProperties = {
			padding,
			textAlign: alignment,
			display: 'flex',
			flexDirection: 'column',
			minWidth: 0, // Allow shrinking below content width
		}

		// If width is a specific pixel value, use flex-basis
		if (width && width !== 'auto' && width !== '100%') {
			baseStyle.flexBasis = width
			baseStyle.flexGrow = 0
			baseStyle.flexShrink = 0
			baseStyle.minWidth = parseInt(width) > window.innerWidth ? '100%' : width
		} else if (width === '100%') {
			baseStyle.flexBasis = '100%'
			baseStyle.flexGrow = 1
		} else {
			// Default: auto width, but limit growth so columns can be side by side
			baseStyle.flexBasis = 'auto'
			baseStyle.flexGrow = 0
			baseStyle.flexShrink = 1
			baseStyle.minWidth = '300px' // Give a reasonable minimum width
		}

		return baseStyle
	}

	return (
		<div
			className={`column-block align-${alignment}`}
			style={getColumnStyle()}
			data-label={label}
		>
			{content.map((child: any) => renderBlock(child))}
		</div>
	)
}

export default Column
