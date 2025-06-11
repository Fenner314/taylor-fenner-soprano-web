import React from 'react'
import { useAnalytics } from '../../../contexts/AnalyticsContext'
import './Button.css'

interface BlockType {
	_key?: string
	_id?: string
	_type?: 'button'
	text?: string
	url?: string
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
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

interface ButtonProps {
	block: BlockType
	styles?: React.CSSProperties
	type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({ block, ...props }) => {
	const { trackEvent } = useAnalytics()

	// Only keep custom styles that can't be handled by CSS classes
	const getCustomStyles = () => {
		const styles: React.CSSProperties = { ...props.styles }

		if (block.customStyles?.backgroundColor) {
			styles.backgroundColor = block.customStyles.backgroundColor.hex
		}
		if (block.customStyles?.textColor) {
			styles.color = block.customStyles.textColor.hex
		}

		return styles
	}

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		// Track the button click
		trackEvent('Button', 'click', block.text || 'Unnamed Button')

		if (block.onClick) {
			e.preventDefault()
			block.onClick(e)
		}
	}

	// For submit buttons, we don't want to wrap in an anchor tag
	if (props.type === 'submit') {
		return (
			<div
				key={block._key || block._id}
				className={`button-section ${block.buttonType || 'contained'} ${
					block.colorScheme || 'primary'
				}`}
			>
				<button
					className={`button-element ${block.size || 'medium'} ${
						block.width === 'stretch' ? 'stretch' : ''
					}`}
					aria-label={block.ariaLabel}
					style={getCustomStyles()}
					type={props.type}
					onClick={handleClick}
				>
					{block.text}
				</button>
			</div>
		)
	}

	return (
		<div
			key={block._key || block._id}
			className={`button-section ${block.buttonType || 'contained'} ${
				block.colorScheme || 'primary'
			}`}
		>
			<a
				href={block.url}
				target={block.openInNewTab ? '_blank' : '_self'}
				rel={block.openInNewTab ? 'noopener noreferrer' : undefined}
				className={`button-link ${block.width === 'stretch' ? 'stretch' : ''}`}
				onClick={() => trackEvent('Link', 'click', block.url || 'Unknown URL')}
			>
				<button
					className={`button-element ${block.size || 'medium'}`}
					aria-label={block.ariaLabel}
					style={getCustomStyles()}
					type={props.type}
					onClick={handleClick}
				>
					{block.text}
				</button>
			</a>
		</div>
	)
}

export default Button
