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

	// Generate comprehensive mock data for multiple years
	const generateMockEvents = (year: number): Event[] => {
		const events: Event[] = [
			{
				id: `${year}-la-traviata`,
				title: 'La Traviata Performance',
				start: `${year}-07-15T19:30:00`,
				end: `${year}-07-15T22:00:00`,
				description: `Evening performance of Verdi's La Traviata at the Metropolitan Opera House.`,
				location: 'Metropolitan Opera House, New York',
				url: 'https://tickets.example.com/la-traviata',
				// featured: true,
			},
			{
				id: `${year}-masterclass`,
				title: 'Masterclass: Vocal Techniques',
				start: `${year}-06-20T14:00:00`,
				end: `${year}-06-20T16:00:00`,
				description:
					'Interactive masterclass focusing on advanced vocal techniques for opera singers.',
				location: 'Juilliard School, New York',
			},
			{
				id: `${year}-recital`,
				title: 'Recital: Italian Art Songs',
				start: `${year}-08-10T20:00:00`,
				end: `${year}-08-10T21:30:00`,
				description: 'An intimate evening of Italian art songs and arias.',
				location: 'Carnegie Hall, New York',
				url: 'https://tickets.example.com/recital',
			},
			{
				id: `${year}-boheme`,
				title: 'La Bohème Performance',
				start: `${year}-09-05T19:00:00`,
				end: `${year}-09-05T22:30:00`,
				description: "Opening night of Puccini's beloved La Bohème.",
				location: 'Lincoln Center, New York',
				// featured: year === new Date().getFullYear(), // Only current year is featured
			},
			{
				id: `${year}-workshop`,
				title: 'Young Artists Workshop',
				start: `${year}-10-12T10:00:00`,
				end: `${year}-10-12T17:00:00`,
				description: 'Full-day workshop for emerging opera singers.',
				location: 'Metropolitan Opera Studio',
			},
			{
				id: `${year}-gala`,
				title: 'Annual Opera Gala',
				start: `${year}-11-30T18:00:00`,
				end: `${year}-11-30T23:00:00`,
				description: 'Elegant evening gala featuring opera highlights and dinner.',
				location: 'Grand Ballroom, Plaza Hotel',
				url: 'https://tickets.example.com/gala',
				// featured: true,
			},
			{
				id: `${year}-holiday`,
				title: 'Holiday Concert',
				start: `${year}-12-15T19:30:00`,
				end: `${year}-12-15T21:00:00`,
				description: 'Festive holiday concert featuring seasonal classics.',
				location: "St. Patrick's Cathedral, New York",
			},
			{
				id: `${year + 1}-winter`,
				title: 'Winter Showcase',
				start: `${year + 1}-01-20T20:00:00`,
				end: `${year + 1}-01-20T22:00:00`,
				description: 'Winter showcase featuring student performances.',
				location: 'Juilliard School, New York',
			},
			{
				id: `${year + 1}-valentine`,
				title: "Valentine's Day Special",
				start: `${year + 1}-02-14T19:00:00`,
				end: `${year + 1}-02-14T21:30:00`,
				description: 'Romantic evening of love songs and duets.',
				location: 'Lincoln Center, New York',
				// featured: true,
			},
			{
				id: `${year + 1}-spring`,
				title: 'Spring Recital',
				start: `${year + 1}-04-22T15:00:00`,
				end: `${year + 1}-04-22T17:00:00`,
				description: 'Afternoon recital celebrating the arrival of spring.',
				location: 'Carnegie Hall, New York',
			},
			{
				id: `${year + 1}-finale`,
				title: 'Season Finale Gala',
				start: `${year + 1}-05-28T18:30:00`,
				end: `${year + 1}-05-28T23:30:00`,
				description: 'Grand finale celebration of the opera season.',
				location: 'Metropolitan Opera House, New York',
				url: 'https://tickets.example.com/finale',
				// featured: true,
			},
		]

		// Don't include events from before 2020 (simulate no historical data)
		return year >= 2020 ? events : []
	}

	const fetchEventsForYear = async (year: number): Promise<Event[]> => {
		try {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 500))

			// For mock data - in real implementation, this would be Google Calendar API
			const yearEvents = generateMockEvents(year)

			/* 
      TODO: Replace with actual Google Calendar API call:
      
      const startDate = new Date(year, 5, 1) // June 1st of the year
      const endDate = new Date(year + 1, 4, 31) // May 31st of next year
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?` +
        new URLSearchParams({
          key: process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY,
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          maxResults: '50',
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
        featured: item.description?.includes('[FEATURED]')
      })) || []
      
      return googleEvents
      */

			return yearEvents
		} catch (err) {
			console.error(`Error fetching events for ${year}:`, err)
			return []
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

			// Check if there are more events available (simulate checking previous years)
			const hasMoreData = year > 2020 // Simulate data availability from 2020
			setHasMoreEvents(hasMoreData)
		} catch (err) {
			setError('Failed to load events')
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

	// Sort events by date (soonest first)
	const sortedEvents = [...events].sort((a, b) => {
		if (a.start && b.start) {
			return new Date(a.start).getTime() - new Date(b.start).getTime()
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
								buttonType: 'contained',
								colorScheme: 'primary',
								size: 'medium',
								customStyles: loadingMore
									? {
											backgroundColor: { hex: 'var(--secondary)' },
										}
									: undefined,
							}}
						/>
					)
				)}
			</div>
		</div>
	)
}

export default EventsComponent
