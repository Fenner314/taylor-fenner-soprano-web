import React from 'react'

// Import your custom page components
import ContactForm from '../components/custom/ContactForm'
import Events from '../components/custom/Events'

export interface CustomComponentProps {
	[key: string]: any
}

// Registry of custom components
const customComponents: Record<string, React.FC<CustomComponentProps>> = {
	'contact-form': ContactForm,
	events: Events,
}

export const getCustomPageComponent = (
	componentName: string
): React.FC<CustomComponentProps> | null => {
	console.log(componentName)
	console.log(customComponents[componentName])
	return customComponents[componentName] || null
}

// Helper to register new custom components
export const registerCustomComponent = (
	name: string,
	component: React.FC<CustomComponentProps>
) => {
	customComponents[name] = component
}
