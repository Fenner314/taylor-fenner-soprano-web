// TypeScript types for Sanity content
export interface Page {
	_id: string
	title: string
	pageType: 'home' | 'about' | 'media' | 'contact'
}

export interface Biography {
	_id: string
	title: string
	content: any[] // Portable Text array
	sortOrder: number
	assignedPage: Page
}

export interface Button {
	_id: string
	title: string
	text: string
	url: string
	buttonType: 'primary' | 'secondary' | 'tertiary'
	colorScheme: 'primary' | 'secondary' | 'accent'
	width: 'stretch' | 'fit'
	size: 'small' | 'medium' | 'large'
	customStyles?: {
		backgroundColor?: { hex: string }
		textColor?: { hex: string }
	}
	openInNewTab: boolean
	ariaLabel?: string
}

export interface Quote {
	_id: string
	quoteText: string
	author?: string
}

export interface DownloadItem {
	_id: string
	title: string
	description?: string
	linkUrl: string
}

export interface MediaImage {
	_id: string
	title: string
	image: any
	description?: string
	organization?: string
}

export interface VideoRecording {
	_id: string
	title: string
	description?: string
	videoUrl: string
}

export interface Event {
	_id: string
	title: string
	date: string
	description?: string
	location?: string
	featured: boolean
	button?: Button
}
