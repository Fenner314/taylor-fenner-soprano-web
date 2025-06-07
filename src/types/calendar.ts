export interface ParsedEventData {
	description: string
	moreInfo: string | null
	season: string | null
}

export interface CalendarEvent {
	id: string
	title: string
	description: string
	start: string
	end: string
	location: string
	isAllDay: boolean
	url: string
	created: string
	updated: string
	parsedData: ParsedEventData
}

export interface CalendarResponse {
	success: boolean
	events: CalendarEvent[]
	error?: string
}
