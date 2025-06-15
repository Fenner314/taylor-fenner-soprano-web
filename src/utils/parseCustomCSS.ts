export const parseCustomCSS = (cssString?: string): React.CSSProperties => {
	if (!cssString) return {}

	try {
		const trimmedCSS = cssString.trim()
		if (trimmedCSS.startsWith('{')) {
			return JSON.parse(trimmedCSS)
		} else {
			const cssObj: { [key: string]: string } = {}
			const properties = trimmedCSS
				.split(';')
				.map((prop) => prop.trim())
				.filter(Boolean)

			properties.forEach((property) => {
				const colonIndex = property.indexOf(':')
				if (colonIndex === -1) return

				const key = property.slice(0, colonIndex).trim()
				const value = property.slice(colonIndex + 1).trim()

				if (key && value) {
					// Remove !important from the value for inline styles
					const cleanValue = value.replace(/\s*!important\s*$/, '')
					// Convert kebab-case to camelCase for React
					const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
					cssObj[camelKey] = cleanValue
				}
			})

			return cssObj
		}
	} catch (error) {
		console.warn('Error parsing custom CSS:', error)
		return {}
	}
}
