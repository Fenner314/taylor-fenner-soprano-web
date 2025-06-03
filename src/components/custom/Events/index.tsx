import React, { useState, useEffect } from 'react'
import { CustomComponentProps } from '../../../utils/customPageComponents'

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

const EventsComponent: React.FC<CustomComponentProps> = ({
	maxItems = 6,
	showUpcomingOnly = true,
	showPastEvents = false,
	calendarId = 'primary', // Google Calendar ID
	...props
}) => {
	const [events, setEvents] = useState<Event[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchGoogleCalendarEvents = async () => {
			try {
				// For now, using mock data until Google Calendar API is set up
				// TODO: Replace with actual Google Calendar API call
				const mockEvents: Event[] = [
					{
						id: '1',
						title: 'La Traviata Performance',
						start: '2025-07-15T19:30:00',
						end: '2025-07-15T22:00:00',
						description:
							"Evening performance of Verdi's La Traviata at the Metropolitan Opera House.",
						location: 'Metropolitan Opera House, New York',
						url: 'https://tickets.example.com/la-traviata',
						featured: true,
					},
					{
						id: '2',
						title: 'Masterclass: Vocal Techniques',
						start: '2025-06-20T14:00:00',
						end: '2025-06-20T16:00:00',
						description:
							'Interactive masterclass focusing on advanced vocal techniques for opera singers.',
						location: 'Juilliard School, New York',
					},
					{
						id: '3',
						title: 'Recital: Italian Art Songs',
						start: '2025-08-10T20:00:00',
						end: '2025-08-10T21:30:00',
						description: 'An intimate evening of Italian art songs and arias.',
						location: 'Carnegie Hall, New York',
						url: 'https://tickets.example.com/recital',
					},
					{
						id: '4',
						title: 'La Bohème Rehearsal',
						start: '2025-06-05T10:00:00',
						end: '2025-06-05T13:00:00',
						description: 'Final dress rehearsal before opening night.',
						location: 'Opera House Studio A',
					},
				]

				// Filter events based on props
				const now = new Date()
				let filteredEvents = mockEvents

				if (showUpcomingOnly && !showPastEvents) {
					filteredEvents = mockEvents.filter((event) =>
						event.start ? new Date(event.start) > now : true
					)
				} else if (showPastEvents && !showUpcomingOnly) {
					filteredEvents = mockEvents.filter((event) =>
						event.start ? new Date(event.start) < now : true
					)
				}

				// Sort events - featured first, then by date
				filteredEvents.sort((a, b) => {
					if (a.featured && !b.featured) return -1
					if (!a.featured && b.featured) return 1

					if (a.start && b.start) {
						return new Date(a.start).getTime() - new Date(b.start).getTime()
					}
					return 0
				})

				// Limit results
				filteredEvents = filteredEvents.slice(0, maxItems)

				setEvents(filteredEvents)

				/* 
        TODO: Replace mock data with actual Google Calendar API call:
        
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?` +
          new URLSearchParams({
            key: process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY,
            timeMin: showUpcomingOnly ? new Date().toISOString() : undefined,
            timeMax: showPastEvents ? new Date().toISOString() : undefined,
            maxResults: maxItems.toString(),
            singleEvents: 'true',
            orderBy: 'startTime'
          })
        )
        
        const data = await response.json()
        
        const googleEvents: Event[] = data.items?.map((item: any) => ({
          id: item.id,
          title: item.summary,
          start: item.start?.dateTime || item.start?.date,
          end: item.end?.dateTime || item.end?.date,
          description: item.description,
          location: item.location,
          url: item.htmlLink,
          featured: item.description?.includes('[FEATURED]') // or however you mark featured events
        })) || []
        
        setEvents(googleEvents)
        */
			} catch (err) {
				console.error('Error fetching calendar events:', err)
				setError('Failed to load events from calendar')
			} finally {
				setLoading(false)
			}
		}

		fetchGoogleCalendarEvents()
	}, [maxItems, showUpcomingOnly, showPastEvents, calendarId])

	if (loading) return <div>Loading events from calendar...</div>

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
				<p>No events scheduled at this time.</p>
			</div>
		)
	}

	return (
		<div className='events-component'>
			<div
				className='events-grid'
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1.5rem',
				}}
			>
				{events.map((event) => (
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
								color: event.featured ? 'var(--dark)' : 'var(--primary)',
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
								}}
							>
								📅{' '}
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
								}}
							>
								<strong>📍 Location:</strong> {event.location}
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
							<a
								href={event.url}
								className='cta-button'
								target='_blank'
								rel='noopener noreferrer'
								style={{
									display: 'inline-block',
									marginTop: '0.5rem',
									background: event.featured ? 'var(--primary)' : undefined,
								}}
							>
								View Details
							</a>
						)}
					</div>
				))}
			</div>

			<div
				style={{
					marginTop: '1rem',
					fontSize: '0.8rem',
					color: 'var(--secondary)',
					textAlign: 'center',
				}}
			>
				Events synced from Google Calendar
			</div>
		</div>
	)
}

export default EventsComponent
