import React from 'react'
import { useParams } from 'react-router-dom'
import { getCustomPageComponent } from '../../utils/customPageComponents'
import renderBlock from '../../utils/renderBlock'
import { usePagesContext } from '../../contexts/PagesContext'
import Loading from '../../components/blocks/Loading'
import './DynamicPage.css'
import Title from '../../components/custom/Title'

const DynamicPage: React.FC = () => {
	const { slug } = useParams<{ slug: string }>()
	const { pages, isLoading, error, lastUpdated } = usePagesContext()

	// Find the current page from the loaded pages
	const currentSlug = slug ? `/${slug}` : '/'
	const pageData = pages.find((page) => page.slug.current === currentSlug)

	// Only show loading if we don't have cached data
	if (isLoading && !lastUpdated) {
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

	if (!pageData) {
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
					<h2>Page Not Found</h2>
					<p>The page you're looking for doesn't exist.</p>
				</div>
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
