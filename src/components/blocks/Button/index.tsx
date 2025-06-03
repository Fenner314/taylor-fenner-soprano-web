import React from 'react'

interface ButtonProps {
	block: {
		_key?: string
		_id?: string
		_type: 'button'
		text: string
		url: string
		buttonType?: string
		colorScheme?: string
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
	return (
		<div
			key={block._key || block._id}
			className='button-section'
			style={{ margin: '2rem 0', textAlign: 'center' }}
		>
			<a
				href={block.url}
				className='cta-button'
				target={block.openInNewTab ? '_blank' : '_self'}
				rel={block.openInNewTab ? 'noopener noreferrer' : undefined}
				aria-label={block.ariaLabel}
				style={{
					backgroundColor: block.customStyles?.backgroundColor?.hex || undefined,
					color: block.customStyles?.textColor?.hex || undefined,
					width: block.width === 'stretch' ? '100%' : 'auto',
					fontSize:
						block.size === 'small'
							? '0.875rem'
							: block.size === 'large'
								? '1.125rem'
								: '1rem',
					padding:
						block.size === 'small'
							? '0.5rem 1rem'
							: block.size === 'large'
								? '1rem 2rem'
								: '0.75rem 1.5rem',
				}}
			>
				{block.text}
			</a>
		</div>
	)
}

export default Button
