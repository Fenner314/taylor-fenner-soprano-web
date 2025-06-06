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
}

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
	const [pages, setPages] = useState<PageData[]>([])
	const [currentPage, setCurrentPage] = useState<PageData | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchAllPages = async () => {
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
		} catch (err) {
			console.error('Error fetching all pages:', err)
			setError('Failed to load pages')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchAllPages()
	}, [])

	const value = {
		pages,
		currentPage,
		isLoading,
		error,
	}

	return <PagesContext.Provider value={value}>{children}</PagesContext.Provider>
}
