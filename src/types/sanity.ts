// TypeScript types for Sanity content

export interface StyleSettings {
	backgroundColor?: string
	customCSS?: string
}

export interface BlockBase {
	_id: string
	label?: string
	styles?: StyleSettings
}

export interface Page extends BlockBase {
	title: string
	pageType: 'home' | 'about' | 'media' | 'contact'
}

export interface Biography extends BlockBase {
	title: string
	content: any[] // Portable Text array
	sortOrder: number
	assignedPage: Page
}

export interface Button extends BlockBase {
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

export interface Quote extends BlockBase {
	quoteText: string
	author?: string
}

export interface DownloadItem extends BlockBase {
	title: string
	description?: string
	linkUrl: string
}

export interface MediaImage extends BlockBase {
	title: string
	image: any
	description?: string
	organization?: string
}

export interface VideoRecording extends BlockBase {
	title: string
	description?: string
	url: string
	organization?: string
}

export interface Event extends BlockBase {
	title: string
	date: string
	description?: string
	location?: string
	featured: boolean
	button?: Button
}

export interface Hero extends BlockBase {
	title?: string
	text?: any[] // Portable Text array
	image?: any
	parallax?: boolean
}

export interface MediaGrid extends BlockBase {
	title?: string
	images: MediaImage[]
}

export interface BlockBanner extends BlockBase {
	title?: string
	text?: any[] // Portable Text array
	image?: any
}

export interface Downloads extends BlockBase {
	title?: string
	items: DownloadItem[]
}

export interface CustomComponent extends BlockBase {
	componentName: string
	props?: string // JSON string
}
