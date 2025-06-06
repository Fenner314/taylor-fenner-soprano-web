import React, { useEffect, useRef } from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '../../../utils/portableTextComponents'
import './BlockBanner.css'
import Button from '../Button'

interface BlockBannerProps {
	block: {
		_key?: string
		_id?: string
		_type: 'blockBanner'
		label?: string
		title?: string
		text?: {
			content: any[]
		}
		button?: {
			_type: 'reference'
			_ref: string
			_key?: string
		} & {
			title?: string
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
		}
	}
}

const BlockBanner: React.FC<BlockBannerProps> = ({ block }) => {
	const bannerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const updateMargin = () => {
			const banner = bannerRef.current
			if (!banner) return

			const title = banner.getAttribute('data-page')
			if (title === 'home-blockBanner' || title === 'biography-blockBanner') {
				const height = banner.offsetHeight
				banner.style.marginTop = `calc(-1 * (var(--spacing-2xl) + ${height * 0.25}px))`
			}
		}

		// Update on mount
		updateMargin()

		// Update on window resize
		window.addEventListener('resize', updateMargin)

		// Cleanup
		return () => window.removeEventListener('resize', updateMargin)
	}, [])

	return (
		<div
			ref={bannerRef}
			key={block._key || block._id}
			className='block-banner'
			data-page={block.label}
		>
			{block.text?.content && (
				<div className='rich-text'>
					<PortableText
						value={block.text?.content}
						components={portableTextComponents}
					/>
				</div>
			)}
			{block.button && (
				<Button
					block={{
						...(block.button as any),
						buttonType: block.button.buttonType || 'contained',
						colorScheme: block.button.colorScheme || 'primary',
					}}
				/>
			)}
		</div>
	)
}

export default BlockBanner
