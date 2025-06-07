import React, { useState, useEffect } from 'react'
import { CustomComponentProps } from '../../../utils/customPageComponents'
import './Events.css'
import Title from '../Title'
import Button from '../../blocks/Button'
import calendarIcon from '../../../assets/icons/calendar.png'
import pinIcon from '../../../assets/icons/pin.png'

interface Event {
	id: string
	title: string
	start?: string
	end?: string
	description?: string
	location?: string
	url?: string
	featured?: boolean
}

const calendarId = 'primary'
const eventsPageUrl = '/events'

const EventsComponent: React.FC<CustomComponentProps> = ({ title, props }) => {
	const [events, setEvents] = useState<Event[]>([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [currentYear, setCurrentYear] = useState(() => {
		// Start from the most recent June 1st
		const now = new Date()
		const currentMonth = now.getMonth() // 0-based
		const currentYearNum = now.getFullYear()

		// If we're before June, use previous year's June
		return currentMonth < 5 ? currentYearNum - 1 : currentYearNum
	})
	const [hasMoreEvents, setHasMoreEvents] = useState(true)
	const [allLoadedYears, setAllLoadedYears] = useState<number[]>([])

	const fetchEventsForYear = async (year: number): Promise<Event[]> => {
		try {
			const startDate = new Date(year, 5, 1) // June 1st of the year
			const endDate = new Date(year + 1, 4, 31) // May 31st of next year

			const calendarId = process.env.REACT_APP_GOOGLE_CALENDAR_ID
			const apiKey = process.env.REACT_APP_GOOGLE_API_KEY

			if (!calendarId || !apiKey) {
				throw new Error('Missing calendar ID or API key in environment variables')
			}

			const response = await fetch(
				`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
					calendarId
				)}/events?` +
					new URLSearchParams({
						key: apiKey,
						timeMin: startDate.toISOString(),
						timeMax: endDate.toISOString(),
						maxResults: '50',
						singleEvents: 'true',
						orderBy: 'startTime',
					})
			)

			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(`Calendar API error: ${response.status} - ${errorText}`)
			}

			const data = await response.json()

			const googleEvents: Event[] =
				data.items?.map((item: any) => {
					// Parse the description for structured data
					const description = item.description || ''
					const lines = description.trim().split('<br>')
					let parsedDescription = description
					let parsedUrl = ''
					let featured = false

					lines.forEach((line: any) => {
						const colonIndex = line.indexOf(':')
						if (colonIndex > 0) {
							const key = line.substring(0, colonIndex).trim().toLowerCase()
							if (key === 'description') {
								parsedDescription = line.substring(colonIndex + 1).trim()
							} else if (
								key === 'featured' &&
								line
									.substring(colonIndex + 1)
									.trim()
									.toLowerCase() === 'true'
							) {
								featured = true
							} else if (key === 'url') {
								const url = line.substring(colonIndex + 1).trim()
								if (url.match(/href="([^"]+)"/)) {
									parsedUrl = url.match(/href="([^"]+)"/)[1]
								} else {
									parsedUrl = url
								}
							}
						}
					})

					return {
						id: item.id,
						title: item.summary || 'No Title',
						start: item.start?.dateTime || item.start?.date,
						end: item.end?.dateTime || item.end?.date,
						description: parsedDescription,
						location: item.location,
						url: parsedUrl,
						featured: featured,
					}
				}) || []

			return googleEvents
		} catch (err) {
			console.error(`Error fetching events for ${year}:`, err)
			throw err // Let the error be handled by the loadEvents function
		}
	}

	const loadEvents = async (year: number, append = false) => {
		if (append) {
			setLoadingMore(true)
		} else {
			setLoading(true)
		}

		try {
			const yearEvents = await fetchEventsForYear(year)

			if (append) {
				setEvents((prev) => [...prev, ...yearEvents])
				setAllLoadedYears((prev) => [...prev, year])
			} else {
				setEvents(yearEvents)
				setAllLoadedYears([year])
			}

			// Check if there are more events available
			// We'll keep loading until we hit a year with no events
			setHasMoreEvents(yearEvents.length > 0)
		} catch (err) {
			console.error('Failed to load events:', err)
			setError(err instanceof Error ? err.message : 'Failed to load events')
		} finally {
			setLoading(false)
			setLoadingMore(false)
		}
	}

	const loadMoreEvents = async () => {
		const nextYear = currentYear - allLoadedYears.length
		if (nextYear >= 2020) {
			// Don't go before 2020
			await loadEvents(nextYear, true)
		}
	}

	useEffect(() => {
		loadEvents(currentYear)
	}, [currentYear, calendarId])

	if (loading) return <div>Loading events...</div>

	if (error) {
		return (
			<div className='error' style={{ margin: '1rem 0' }}>
				{error}
			</div>
		)
	}

	if (events.length === 0) {
		return (
			<div className='cta-section'>
				<p>No events available at this time.</p>
			</div>
		)
	}

	// Sort events by date (newest first)
	const sortedEvents = [...events].sort((a, b) => {
		if (a.start && b.start) {
			return new Date(b.start).getTime() - new Date(a.start).getTime()
		}
		return 0
	})

	// Filter for only upcoming events
	const now = new Date()
	const upcomingEvents = sortedEvents.filter((event) => {
		if (!event.start) return false
		return new Date(event.start) >= now
	})

	// Show only 3 upcoming events in preview mode
	const displayEvents = props.preview ? upcomingEvents.slice(0, 3) : sortedEvents

	return (
		<div className='events-component'>
			{props.preview && (
				<h2 className='events-title'>
					<Title>Upcoming Events</Title>
				</h2>
			)}
			<div
				className='events-grid'
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1.5rem',
				}}
			>
				{displayEvents.map((event) => (
					<div
						key={event.id}
						className={`event-item ${event.featured ? 'featured' : ''}`}
						style={{
							margin: 0,
							padding: '1.5rem',
							background: event.featured ? 'var(--accent)' : 'var(--bg-gray-1)',
							borderRadius: '12px',
							border: event.featured
								? '2px solid var(--primary)'
								: '1px solid var(--bg-gray-2)',
							position: 'relative',
						}}
					>
						{event.featured && (
							<div
								style={{
									position: 'absolute',
									top: '-10px',
									right: '1rem',
									background: 'var(--primary)',
									color: 'white',
									padding: '0.25rem 0.75rem',
									borderRadius: '12px',
									fontSize: '0.8rem',
									fontWeight: '600',
								}}
							>
								Featured
							</div>
						)}

						<h3
							className='media-title'
							style={{
								color: event.featured ? 'var(--accent)' : 'var(--text-dark)',
								marginBottom: '0.75rem',
							}}
						>
							{event.title}
						</h3>

						{event.start && (
							<p
								style={{
									color: event.featured ? 'var(--dark)' : 'var(--secondary)',
									fontWeight: '600',
									marginBottom: '0.5rem',
									fontSize: '1rem',
									display: 'flex',
									alignItems: 'center',
									gap: '0.5rem',
								}}
							>
								<img
									src={calendarIcon}
									alt='Calendar'
									style={{
										width: '16px',
										height: '16px',
										objectFit: 'contain',
									}}
								/>{' '}
								{new Date(event.start).toLocaleDateString('en-US', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
								})}
								{event.end && (
									<span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
										{' - '}
										{new Date(event.end).toLocaleTimeString('en-US', {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</span>
								)}
							</p>
						)}

						{event.location && (
							<p
								style={{
									marginBottom: '0.75rem',
									color: event.featured ? 'var(--dark)' : 'var(--dark)',
									display: 'flex',
									alignItems: 'center',
									gap: '0.5rem',
								}}
							>
								<img
									src={pinIcon}
									alt='Location'
									style={{
										width: '16px',
										height: '16px',
										objectFit: 'contain',
									}}
								/>
								<span>
									<strong>Location:</strong> {event.location}
								</span>
							</p>
						)}

						{event.description && (
							<p
								style={{
									marginBottom: '1rem',
									lineHeight: '1.5',
									color: event.featured ? 'var(--dark)' : 'var(--dark)',
								}}
							>
								{event.description}
							</p>
						)}

						{event.url && (
							<Button
								block={{
									_type: 'button',
									text: 'View Details',
									url: event.url,
									buttonType: 'outlined',
									colorScheme: 'primary',
									size: 'small',
									openInNewTab: true,
								}}
							/>
						)}
					</div>
				))}
			</div>

			{/* Action buttons */}
			<div
				style={{
					display: 'flex',
					gap: '1rem',
					justifyContent: 'center',
					marginTop: '2rem',
					flexWrap: 'wrap',
				}}
			>
				{props.preview ? (
					<Button
						block={{
							_type: 'button',
							text: 'View All Events',
							url: eventsPageUrl,
							buttonType: 'text',
							colorScheme: 'primary',
							size: 'medium',
						}}
					/>
				) : (
					hasMoreEvents && (
						<Button
							block={{
								_type: 'button',
								text: loadingMore
									? 'Loading...'
									: `Load Previous Year (${currentYear - allLoadedYears.length})`,
								url: '#',
								buttonType: 'text',
								colorScheme: 'primary',
								size: 'medium',
								customStyles: loadingMore
									? {
											backgroundColor: { hex: 'var(--secondary)' },
										}
									: undefined,
								onClick: (e) => {
									e.preventDefault()
									loadMoreEvents()
								},
							}}
						/>
					)
				)}
			</div>
		</div>
	)
}

export default EventsComponent
