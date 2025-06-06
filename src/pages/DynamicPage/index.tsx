import React from 'react'
import { useParams } from 'react-router-dom'
import { getCustomPageComponent } from '../../utils/customPageComponents'
import renderBlock from '../../utils/renderBlock'
import { usePagesContext } from '../../contexts/PagesContext'
import './DynamicPage.css'
import Title from '../../components/custom/Title'

const DynamicPage: React.FC = () => {
	const { slug } = useParams<{ slug: string }>()
	const { pages, isLoading, error } = usePagesContext()

	// Find the current page from the loaded pages
	const currentSlug = slug ? `/${slug}` : '/'
	const pageData = pages.find((page) => page.slug.current === currentSlug)

	if (isLoading) {
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
