import React, { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { getCustomPageComponent } from '../../utils/customPageComponents'
import renderBlock from '../../utils/renderBlock'
import { usePagesContext } from '../../contexts/PagesContext'
import Loading from '../../components/blocks/Loading'
import './DynamicPage.css'
import Title from '../../components/custom/Title'
import NotFound from '../NotFound'
import Hero from '../../components/blocks/Hero'
import ParallaxBackground from '../../components/custom/ParallaxBackground'
import Section from '../../components/blocks/Section'
import BrandTitle from '../../components/custom/BrandTitle'

const DynamicPage: React.FC = () => {
	const { slug } = useParams<{ slug: string }>()
	const {
		pages,
		isLoading,
		error,
		lastUpdated,
		parallaxSections,
		clearParallaxSections,
		registerParallaxSection,
	} = usePagesContext()
	const location = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location.pathname])

	// Find the current page from the loaded pages
	const currentSlug = slug ? `/${slug}` : '/'
	const pageData = pages.find((page) => page.slug.current === currentSlug)

	useEffect(() => {
		clearParallaxSections()

		if (!pageData) return

		pageData.content?.forEach((block, index) => {
			// Register parallax sections based on block type
			if (
				(block._type === 'hero' && block.parallax) ||
				block._type === 'parallax'
			) {
				registerParallaxSection({
					id: block._key || index,
					page:
						pageData.slug.current === '/'
							? 'home'
							: pageData.slug.current.replace('/', ''),
					component: <ParallaxBackground block={block} />,
				})
			}
		})
	}, [pageData])

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

	// Helper to render blocks recursively
	const renderPageBlock = (
		block: any,
		index: number,
		arr: any[],
		context: { isInMediaGrid?: boolean } = {}
	) => {
		// Look for a section after the hero
		const next = arr && arr[index + 1]
		// Look for a section before the hero
		const prev = arr && arr[index - 1]

		if (block._type === 'hero') {
			const hasNextAngled = next?._type === 'section' && next.angled
			const hasPrevAngled = prev?._type === 'section' && prev.angled

			if (hasNextAngled && hasPrevAngled) {
				// Hero has both top and bottom angles
				return (
					<Hero
						key={block._key || block._id || index}
						block={block}
						angled={true}
						anglePosition='both'
						topAngleColor={
							prev.backgroundColor || prev.sectionColor || 'var(--primary)'
						}
						bottomAngleColor={
							next.backgroundColor || next.sectionColor || 'var(--primary)'
						}
					/>
				)
			} else if (hasNextAngled) {
				// Hero has only bottom angle
				return (
					<Hero
						key={block._key || block._id || index}
						block={block}
						angled={true}
						anglePosition='bottom-left'
						angleColor={next.backgroundColor || next.sectionColor || 'var(--primary)'}
					/>
				)
			} else if (hasPrevAngled) {
				// Hero has only top angle
				return (
					<Hero
						key={block._key || block._id || index}
						block={block}
						angled={true}
						anglePosition='top-right'
						angleColor={prev.backgroundColor || prev.sectionColor || 'var(--primary)'}
					/>
				)
			}
			return <Hero key={block._key || block._id || index} block={block} />
		}

		if (block._type === 'section') {
			// Find next and previous sections
			const next = arr && arr[index + 1]
			const prev = arr && arr[index - 1]

			// Only show bottom overlay if this section is angled and the next is angled
			const showBottomOverlay =
				block.angled && next?._type === 'section' && next.angled
			// Only show top overlay if this section is angled and the previous is angled, and the previous is NOT also angled (so no double overlay)
			const showTopOverlay =
				block.angled &&
				prev?._type === 'section' &&
				prev.angled &&
				!(prev.angled && block.angled)

			return (
				<Section
					key={block._key || block._id || index}
					block={block}
					nextSectionAngled={showBottomOverlay}
					nextSectionColor={next?.backgroundColor || next?.sectionColor || undefined}
					prevSectionAngled={showTopOverlay}
					prevSectionColor={prev?.backgroundColor || prev?.sectionColor || undefined}
				>
					{block.content &&
						block.content.length > 0 &&
						block.content.map((child: any, childIdx: number, childArr: any[]) =>
							renderPageBlock(child, childIdx, childArr, context)
						)}
				</Section>
			)
		}

		// Use renderBlock for all other block types
		return (
			<React.Fragment key={block._key || block._id || index}>
				{renderBlock(block, context)}
			</React.Fragment>
		)
	}

	return (
		<div className='page-container' data-page={pageData.title?.toLowerCase()}>
			{pageData.title === 'Home' && <BrandTitle />}

			{/* Sanity page builder content */}
			{pageData.content && pageData.content.length > 0 && (
				<div className='page-builder-content'>
					{pageData.content.map((block, index, arr) =>
						renderPageBlock(block, index, arr, {})
					)}
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
