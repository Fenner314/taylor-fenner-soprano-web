import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { getCustomPageComponent } from '../../utils/customPageComponents'
import renderBlock from '../../utils/renderBlock'
import { usePagesContext } from '../../contexts/PagesContext'
import Loading from '../../components/blocks/Loading'
import './DynamicPage.css'
import Title from '../../components/custom/Title'
import NotFound from '../NotFound'

const DynamicPage: React.FC = () => {
	const { slug } = useParams<{ slug: string }>()
	const { pages, isLoading, error, lastUpdated } = usePagesContext()
	const location = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location.pathname])

	// Find the current page from the loaded pages
	const currentSlug = slug ? `/${slug}` : '/'
	const pageData = pages.find((page) => page.slug.current === currentSlug)

	if ((isLoading && !lastUpdated) || pages.length === 0) {
		return (
			<div className='page-container'>
				<Loading text='Loading page content...' size='large' />
			</div>
		)
	}

	if (error && !lastUpdated) {
		return (
			<div className='page-container'>
				<div
					className='error'
					style={{
						padding: '2rem',
						textAlign: 'center',
						color: 'var(--error)',
						maxWidth: '600px',
						margin: '0 auto',
					}}
				>
					<h2>Error Loading Page</h2>
					<p>{error}</p>
				</div>
			</div>
		)
	}

	// Only show "Page Not Found" if we have loaded pages but can't find the requested one
	if (!pageData && pages.length > 0) {
		return (
			<div className='page-container'>
				<NotFound />
			</div>
		)
	}

	if (!pageData) {
		return (
			<div className='page-container'>
				<Loading text='Loading page content...' size='large' />
			</div>
		)
	}

	// Get custom component if specified
	const CustomComponent = pageData.customComponent
		? getCustomPageComponent(pageData.customComponent)
		: null

	return (
		<div className='page-container' data-page={pageData.title?.toLowerCase()}>
			{pageData.title !== 'Home' &&
				pageData.title !== 'Events' &&
				pageData.title && <Title>{pageData.title}</Title>}

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

			{/* Show background refresh indicator */}
			{isLoading && lastUpdated && (
				<div
					style={{
						position: 'fixed',
						bottom: '1rem',
						right: '1rem',
						display: 'flex',
						alignItems: 'center',
						gap: '0.5rem',
						background: 'rgba(255, 255, 255, 0.9)',
						padding: '0.5rem 1rem',
						borderRadius: '8px',
						boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
						fontSize: '0.875rem',
						color: 'var(--text-dark)',
						zIndex: 100,
					}}
				>
					<Loading size='small' text='' />
					<span>Updating page content...</span>
				</div>
			)}
		</div>
	)
}

export default DynamicPage
