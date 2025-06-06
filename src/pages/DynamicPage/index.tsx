import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../../lib/sanity'
import { getCustomPageComponent } from '../../utils/customPageComponents'
import renderBlock from '../../utils/renderBlock'
import './DynamicPage.css'
import Title from '../../components/custom/Title'

interface PageData {
	_id: string
	title: string
	slug: { current: string }
	pageType?: string
	content?: any[]
	customComponent?: string
}

const DynamicPage: React.FC = () => {
	const { slug } = useParams<{ slug: string }>()
	const [pageData, setPageData] = useState<PageData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchPageData = async () => {
			try {
				const slugQuery = slug ? `/${slug}` : '/'
				const query = `*[_type == "page" && slug.current == "${slugQuery}"][0]{
					_id,
					title,
					slug,
					pageType,
					customComponent,
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

				const data = await (client as any).fetch(query)

				if (data) {
					setPageData(data)
				} else {
					setError('Page not found')
				}
			} catch (err) {
				console.error('Error fetching page data:', err)
				setError('Failed to load page')
			} finally {
				setLoading(false)
			}
		}

		fetchPageData()
	}, [slug])

	if (loading) {
		return (
			<div className='page-container'>
				<div className='loading'>Loading page...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='page-container'>
				<div className='error'>{error}</div>
			</div>
		)
	}

	if (!pageData) {
		return (
			<div className='page-container'>
				<div className='error'>Page not found</div>
			</div>
		)
	}

	// Get custom component if specified
	const CustomComponent = pageData.customComponent
		? getCustomPageComponent(pageData.customComponent)
		: null

	return (
		<div className='page-container' data-page={pageData.title?.toLowerCase()}>
			{pageData.title !== 'Home' && pageData.title && (
				<Title>{pageData.title}</Title>
			)}

			{/* Sanity page builder content */}
			{pageData.content && pageData.content.length > 0 && (
				<div className='page-builder-content'>
					{pageData.content.map((block, index) => (
						<React.Fragment key={block._key || block._id || index}>
							{renderBlock(block)}
						</React.Fragment>
					))}
				</div>
			)}

			{/* Fallback if no content */}
			{(!pageData.content || pageData.content.length === 0) &&
				!CustomComponent && (
					<div className='cta-section'>
						<p>No content available for this page.</p>
					</div>
				)}
		</div>
	)
}

export default DynamicPage
