import React, { createContext, useContext, useState, useEffect } from 'react'
import { client } from '../lib/sanity'

interface PageData {
	_id: string
	title: string
	slug: { current: string }
	pageType?: string
	content?: any[]
	customComponent?: string
	index: number
}

interface PagesContextType {
	pages: PageData[]
	currentPage: PageData | null
	isLoading: boolean
	error: string | null
	lastUpdated?: string
}

const CACHE_KEY = 'pages_cache'
const CACHE_TIMESTAMP_KEY = 'pages_cache_timestamp'
// Cache expiry time - 24 hours
const CACHE_EXPIRY = 24 * 60 * 60 * 1000

const PagesContext = createContext<PagesContextType>({
	pages: [],
	currentPage: null,
	isLoading: true,
	error: null,
})

export const usePagesContext = () => useContext(PagesContext)

export const PagesProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [pages, setPages] = useState<PageData[]>(() => {
		// Initialize from cache if available
		const cached = localStorage.getItem(CACHE_KEY)
		return cached ? JSON.parse(cached) : []
	})
	const [currentPage, setCurrentPage] = useState<PageData | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [lastUpdated, setLastUpdated] = useState<string>(() => {
		return localStorage.getItem(CACHE_TIMESTAMP_KEY) || ''
	})

	const saveToCache = (data: PageData[]) => {
		try {
			localStorage.setItem(CACHE_KEY, JSON.stringify(data))
			const timestamp = new Date().toISOString()
			localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp)
			setLastUpdated(timestamp)
		} catch (err) {
			console.warn('Failed to save to cache:', err)
		}
	}

	const isCacheValid = (): boolean => {
		const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
		if (!timestamp) return false

		const lastUpdate = new Date(timestamp).getTime()
		const now = new Date().getTime()
		return now - lastUpdate < CACHE_EXPIRY
	}

	const fetchAllPages = async (updateCache = true) => {
		try {
			const query = `*[_type == "page"]{
                _id,
                title,
                slug,
                pageType,
                customComponent,
                index,
                content[]{
                    ...,
                    downloads[]->,
                    button->,
                    "images": images[]{
                        "_key": _key,
                        "_type": _type,
                        ...*[_type == "mediaImage" && _id == ^._ref][0]{
                            title,
                            image,
                            styles,
                            description,
                            organization,
                            role,
                            year,
                            director,
                            conductor,
                            photographer
                        }
                    }
                }
            }`

			// @ts-ignore
			const data = await client.fetch(query)
			setPages(data)

			if (updateCache) {
				saveToCache(data)
			}

			return data
		} catch (err) {
			console.error('Error fetching all pages:', err)
			setError('Failed to load pages')
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		const initializeData = async () => {
			// Check if we have valid cached data
			const cachedData = localStorage.getItem(CACHE_KEY)
			const hasValidCache = cachedData && isCacheValid()

			if (hasValidCache) {
				// Use cached data immediately
				setPages(JSON.parse(cachedData))
				setIsLoading(false)

				// Fetch fresh data in the background
				try {
					await fetchAllPages(true)
				} catch (err) {
					// If background fetch fails, we still have cached data
					console.warn('Background fetch failed:', err)
				}
			} else {
				// No valid cache, do a normal fetch
				try {
					await fetchAllPages(true)
				} catch (err) {
					setError('Failed to load pages')
					setIsLoading(false)
				}
			}
		}

		initializeData()
	}, [])

	const value = {
		pages,
		currentPage,
		isLoading,
		error,
		lastUpdated,
	}

	return <PagesContext.Provider value={value}>{children}</PagesContext.Provider>
}
