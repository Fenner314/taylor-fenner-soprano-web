import React, { createContext, useContext, useEffect } from 'react'
import ReactGA from 'react-ga4'
import { useLocation } from 'react-router-dom'

// Replace with your GA4 measurement ID
const MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || ''

interface AnalyticsContextType {
	trackEvent: (category: string, action: string, label?: string) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
	undefined
)

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const location = useLocation()

	useEffect(() => {
		// Initialize GA4
		ReactGA.initialize(MEASUREMENT_ID)
	}, [])

	// Track page views
	useEffect(() => {
		ReactGA.send({ hitType: 'pageview', page: location.pathname })
	}, [location])

	const trackEvent = (category: string, action: string, label?: string) => {
		ReactGA.event({
			category,
			action,
			label,
		})
	}

	return (
		<AnalyticsContext.Provider value={{ trackEvent }}>
			{children}
		</AnalyticsContext.Provider>
	)
}

export const useAnalytics = () => {
	const context = useContext(AnalyticsContext)
	if (context === undefined) {
		throw new Error('useAnalytics must be used within an AnalyticsProvider')
	}
	return context
}
