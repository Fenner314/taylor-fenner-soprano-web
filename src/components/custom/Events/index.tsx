import React, { useState, useEffect } from 'react'
import { CustomComponentProps } from '../../../utils/customPageComponents'
import './Events.css'
import Title from '../Title'
import Button from '../../blocks/Button'
import Loading from '../../blocks/Loading'
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
	role?: string
	ensemble?: string
	extraProps?: string[]
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

	const fetchEventsForYear = async (
		year: number,
		isCurrentYearFirstHalf = false
	): Promise<Event[]> => {
		try {
			// For current year first half: Jan 1 to May 31
			// For all other cases: June 1 to May 31 of next year
			const startDate = isCurrentYearFirstHalf
				? new Date(year, 0, 1) // January 1st
				: new Date(year, 5, 1) // June 1st
			const endDate = isCurrentYearFirstHalf
				? new Date(year, 4, 31) // May 31st
				: new Date(year + 1, 4, 31) // May 31st of next year

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
			return (
				data.items?.map((item: any) => {
					// Parse the description for structured data
					const description = item.description || ''
					const lines = description
						.trim()
						.split(/<br\/?>/i)
						.flatMap((part: any) => part.split('\n'))
						.map((line: any) => line.trim())
						.filter((line: any) => line.length > 0)
					console.log('lines', lines)
					let parsedDescription = description
					let parsedUrl = ''
					let featured = false
					let role = ''
					let ensemble = ''
					const extraProps: string[] = []

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
							} else if (key === 'role') {
								role = line.substring(colonIndex + 1).trim()
							} else if (key === 'ensemble') {
								ensemble = line.substring(colonIndex + 1).trim()
							} else {
								extraProps.push(line)
							}
						}
					})

					return {
						id: item.id,
						title: item.summary || 'No Title',
						start: item.start?.dateTime || item.start?.date,
						// end: item.end?.dateTime || item.end?.date,
						description: parsedDescription,
						location: item.location,
						url: parsedUrl,
						featured,
						role,
						ensemble,
						extraProps,
					}
				}) || []
			)
		} catch (err) {
			console.error(`Error fetching events for ${year}:`, err)
			throw err
		}
	}

	const loadEvents = async (
		year: number,
		append = false,
		isCurrentYearFirstHalf = false
	) => {
		if (append) {
			setLoadingMore(true)
		} else {
			setLoading(true)
		}

		// Store the exact scroll position
		const scrollPosition = window.scrollY

		try {
			const yearEvents = await fetchEventsForYear(year, isCurrentYearFirstHalf)

			if (append) {
				setEvents((prev) => [...prev, ...yearEvents])
				setAllLoadedYears((prev) => [...prev, year])
			} else {
				setEvents(yearEvents)
				setAllLoadedYears([year])
			}

			setHasMoreEvents(yearEvents.length > 0)

			// After state updates, restore exact scroll position
			if (append) {
				requestAnimationFrame(() => {
					window.scrollTo({
						top: scrollPosition,
						// @ts-ignore
						behavior: 'instant',
					})
				})
			}
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

		// If we haven't loaded first half of current year yet, load that first
		if (!allLoadedYears.includes(currentYear)) {
			await loadEvents(currentYear, true, true)
		} else if (nextYear >= 2020) {
			// Then start loading previous years
			await loadEvents(nextYear, true)
		}
	}

	useEffect(() => {
		// Initial load is always June-December of current year
		loadEvents(currentYear)
	}, [currentYear, calendarId])

	if (loading) return <Loading text='Loading events...' size='large' />

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
	const now = new Date()

	// Split events into upcoming and past
	const allEvents = [...events].sort((a, b) => {
		if (a.start && b.start) {
			return new Date(a.start).getTime() - new Date(b.start).getTime()
		}
		return 0
	})

	const { upcomingEvents, pastEvents } = allEvents.reduce(
		(acc, event) => {
			if (!event.start) return acc
			const eventDate = new Date(event.start)
			if (eventDate >= now) {
				acc.upcomingEvents.push(event)
			} else {
				acc.pastEvents.push(event)
			}
			return acc
		},
		{ upcomingEvents: [] as Event[], pastEvents: [] as Event[] }
	)

	// Sort past events in reverse chronological order
	pastEvents.reverse()

	// For preview mode, show only the first 3 upcoming events
	const displayEvents = props.preview ? upcomingEvents.slice(0, 3) : undefined

	const EventList = ({ events, title }: { events: Event[]; title?: string }) => (
		<>
			{title && (
				<h2 className='events-title' style={{ marginTop: '2rem' }}>
					<Title>{title}</Title>
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
				{events.map((event) => (
					<div className='event-wrapper'>
						{event.featured && <div className='featured-badge'>Featured</div>}
						<div
							key={event.id}
							className={`event-item ${event.featured ? 'featured' : ''}`}
						>
							<h3
								className='media-title'
								style={{
									marginBottom: '0.75rem',
								}}
							>
								{event.title}
							</h3>
							{event.role && <p className='event-role'>{event.role}</p>}
							{event.start && (
								<p
									style={{
										color: event.featured ? 'var(--dark)' : '',
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
									<span>{event.location}</span>
								</p>
							)}
							{event.description && (
								<p
									style={{
										lineHeight: '1.5',
										color: event.featured ? 'var(--dark)' : 'var(--dark)',
									}}
									className='m-0'
								>
									{event.description}
								</p>
							)}
							{event.ensemble && (
								<p className='event-ensemble m-0'>{event.ensemble}</p>
							)}
							{event.extraProps &&
								event.extraProps?.map((prop) => (
									<p key={prop} className='event-extra-prop m-0'>
										{prop}
									</p>
								))}
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
									styles={{ marginTop: '1rem' }}
								/>
							)}
						</div>
					</div>
				))}
			</div>
		</>
	)

	return (
		<div className='events-component'>
			{props.preview ? (
				<>
					<h2 className='events-title'>
						<Title>Upcoming Events</Title>
					</h2>
					<EventList events={displayEvents || []} />
					<div style={{ textAlign: 'center', marginTop: '2rem' }}>
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
					</div>
				</>
			) : (
				<>
					{upcomingEvents.length > 0 && (
						<EventList events={upcomingEvents} title='Upcoming Events' />
					)}
					<EventList
						events={pastEvents}
						title={pastEvents.length > 0 ? 'Past Events' : undefined}
					/>
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
						<Button
							block={{
								_type: 'button',
								text: !allLoadedYears.includes(currentYear)
									? 'Load More Events'
									: `Load Past Events (${currentYear - allLoadedYears.length} - ${currentYear - allLoadedYears.length + 1})`,
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
					</div>
				</>
			)}
		</div>
	)
}

export default EventsComponent
