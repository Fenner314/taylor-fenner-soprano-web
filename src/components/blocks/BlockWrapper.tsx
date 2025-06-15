import React, { useEffect, useRef } from 'react'
import { StyleSettings } from '../../types/sanity'
import './BlockWrapper.css'
import { parseCustomCSS } from '../../utils/parseCustomCSS'

interface BlockWrapperProps {
	children: React.ReactNode
	type: string
	fullWidth?: boolean
	styles?: StyleSettings
	label?: string
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({
	children,
	type,
	fullWidth = false,
	styles,
	label,
}) => {
	const wrapperRef = useRef<HTMLDivElement>(null)

	// Apply !important styles directly to the element
	useEffect(() => {
		const element = wrapperRef.current
		if (!element || !styles?.customCSS) return

		const trimmedCSS = styles.customCSS.trim()
		const properties = trimmedCSS
			.split(';')
			.map((prop) => prop.trim())
			.filter(Boolean)

		properties.forEach((property) => {
			if (property.includes('!important')) {
				const [key, value] = property.split(':').map((s) => s.trim())
				if (key) {
					element.style.setProperty(
						key,
						value.replace(/\s*!important\s*$/, ''),
						'important'
					)
				}
			}
		})

		// Cleanup function to remove styles when component unmounts
		return () => {
			if (element) {
				const properties = trimmedCSS
					.split(';')
					.map((prop) => prop.trim())
					.filter(Boolean)
				properties.forEach((property) => {
					const key = property.split(':')[0]?.trim()
					if (key) {
						element.style.removeProperty(key)
					}
				})
			}
		}
	}, [styles?.customCSS])

	const wrapperStyle: React.CSSProperties = {
		backgroundColor: styles?.backgroundColor || undefined,
		...parseCustomCSS(styles?.customCSS),
	}

	return (
		<div
			ref={wrapperRef}
			className={`block-wrapper ${fullWidth ? 'full-width' : ''}`}
			data-block-type={type}
			style={wrapperStyle}
			data-label={label}
		>
			{children}
		</div>
	)
}

export default BlockWrapper
