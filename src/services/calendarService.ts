import { CalendarEvent, ParsedEventData } from '../types/calendar'

function getSeasonStart(): string {
	const now = new Date()
	const currentYear = now.getFullYear()
	const isBeforeJuneFirst = now < new Date(currentYear, 5, 1)
	const juneFirstYear = isBeforeJuneFirst ? currentYear - 1 : currentYear
	return new Date(juneFirstYear, 5, 1).toISOString()
}

const previousJuneFirst = getSeasonStart()

interface CalendarOptions {
	timeMin?: string
	timeMax?: string
	maxResults?: number
}

export async function getCalendarEvents(options: CalendarOptions = {}) {
	try {
		const {
			timeMin = previousJuneFirst,
			timeMax = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
			maxResults = 50,
		} = options

		const calendarId = process.env.REACT_APP_GOOGLE_CALENDAR_ID
		const apiKey = process.env.REACT_APP_GOOGLE_API_KEY

		if (!calendarId || !apiKey) {
			throw new Error('Missing calendar ID or API key in environment variables')
		}

		const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
			calendarId
		)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&orderBy=startTime&singleEvents=true&maxResults=${maxResults}`

		const response = await fetch(url)

		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(`Calendar API error: ${response.status} - ${errorText}`)
		}

		const data = await response.json()

		return {
			success: true,
			events: data.items
				? data.items.map((event: any) => ({
						id: event.id,
						title: event.summary || 'No Title',
						description: event.description || '',
						start: event.start.dateTime || event.start.date,
						end: event.end.dateTime || event.end.date,
						location: event.location || '',
						isAllDay: !event.start.dateTime,
						url: event.htmlLink || '',
						created: event.created,
						updated: event.updated,
						parsedData: parseEventData(event.description || ''),
					}))
				: [],
		}
	} catch (error) {
		console.error('Calendar fetch error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
			events: [],
		}
	}
}

export function parseEventData(description: string): ParsedEventData {
	const defaultResult: ParsedEventData = {
		description: description || '',
		moreInfo: null,
		season: null,
	}

	if (!description || description.trim() === '') {
		return defaultResult
	}

	const result: ParsedEventData = {
		description: '',
		moreInfo: null,
		season: null,
	}

	try {
		const lines = description.trim().split('<br>')
		let foundStructuredData = false

		lines.forEach((line) => {
			const colonIndex = line.indexOf(':')
			if (colonIndex > 0) {
				const key = line.substring(0, colonIndex).trim().toLowerCase()
				const value = line.substring(colonIndex + 1).trim()

				switch (key) {
					case 'description':
						result.description = value
						foundStructuredData = true
						break
					case 'more-info':
					case 'moreinfo':
					case 'more_info':
						if (value.match(/href="([^"]+)"/)) {
							result.moreInfo = value.match(/href="([^"]+)"/)![1]
						} else {
							result.moreInfo = value
						}
						foundStructuredData = true
						break
					case 'season':
						result.season = value
						foundStructuredData = true
						break
				}
			}
		})

		if (!foundStructuredData) {
			result.description = description
		}

		return result
	} catch (error) {
		console.log('Failed to parse structured data, using as plain text:', error)
		return defaultResult
	}
}

export async function getAllEvents() {
	return await getCalendarEvents()
}

export async function getUpcomingEvents() {
	const now = new Date()
	const thirtyDaysFromNow = new Date()
	thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

	return await getCalendarEvents({
		timeMin: now.toISOString(),
		timeMax: thirtyDaysFromNow.toISOString(),
		maxResults: 10,
	})
}

export async function getCurrentMonthEvents() {
	const now = new Date()
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
	const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

	return await getCalendarEvents({
		timeMin: startOfMonth.toISOString(),
		timeMax: endOfMonth.toISOString(),
		maxResults: 50,
	})
}
