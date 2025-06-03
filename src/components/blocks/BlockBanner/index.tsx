import React from 'react'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '../../../utils/portableTextComponents'
import './BlockBanner.css'
import Button from '../Button'

interface BlockBannerProps {
	block: {
		_key?: string
		_id?: string
		_type: 'blockBanner'
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
	console.log(block)
	return (
		<div
			key={block._key || block._id}
			className='block-banner'
			data-page={block.title?.toLowerCase()}
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
