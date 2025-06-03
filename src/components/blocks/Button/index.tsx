import React from 'react'
import './Button.css'

interface ButtonProps {
	block: {
		_key?: string
		_id?: string
		_type: 'button'
		text: string
		url: string
		buttonType?: 'contained' | 'outlined' | 'text'
		colorScheme?: 'primary' | 'secondary' | 'accent'
		width?: 'stretch' | 'fit'
		size?: 'small' | 'medium' | 'large'
		customStyles?: {
			backgroundColor?: { hex: string }
			textColor?: { hex: string }
		}
		openInNewTab?: boolean
		ariaLabel?: string
	}
}

const Button: React.FC<ButtonProps> = ({ block }) => {
	// Only keep custom styles that can't be handled by CSS classes
	const getCustomStyles = () => {
		const styles: React.CSSProperties = {}

		if (block.customStyles?.backgroundColor) {
			styles.backgroundColor = block.customStyles.backgroundColor.hex
		}
		if (block.customStyles?.textColor) {
			styles.color = block.customStyles.textColor.hex
		}

		return styles
	}

	return (
		<div
			key={block._key || block._id}
			className={`button-section ${block.buttonType || 'contained'} ${block.colorScheme || 'primary'}`}
		>
			<a
				href={block.url}
				target={block.openInNewTab ? '_blank' : '_self'}
				rel={block.openInNewTab ? 'noopener noreferrer' : undefined}
				className={`button-link ${block.width === 'stretch' ? 'stretch' : ''}`}
			>
				<button
					className={`button-element ${block.size || 'medium'}`}
					aria-label={block.ariaLabel}
					style={getCustomStyles()}
					type='button'
				>
					{block.text}
				</button>
			</a>
		</div>
	)
}

export default Button
