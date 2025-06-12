import React from 'react'
import { getCustomPageComponent } from '../../../utils/customPageComponents'

interface CustomComponentProps {
	block: {
		_key?: string
		_id?: string
		_type: 'customComponent'
		title?: string
		component: string
		props?: string
	}
}

const CustomComponent: React.FC<CustomComponentProps> = ({ block }) => {
	const CustomComponent = getCustomPageComponent(block.component)

	if (!CustomComponent) {
		console.warn(`Custom component "${block.component}" not found`)
		return (
			<div className='error' style={{ margin: '1rem 0' }}>
				Custom component "{block.component}" not found
			</div>
		)
	}

	let componentProps = {}
	if (block.props) {
		try {
			componentProps = JSON.parse(block.props)
		} catch (err) {
			console.warn('Invalid JSON in component props:', block.props)
		}
	}

	return (
		<div
			key={block._key || block._id}
			className='custom-component-wrapper'
			style={{ margin: '2rem 0' }}
		>
			<CustomComponent {...componentProps} />
		</div>
	)
}

export default CustomComponent
