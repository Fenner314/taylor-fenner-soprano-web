import React, { useState, useEffect } from 'react'
import { client } from '../../lib/sanity'
import renderBlock from '../../utils/renderBlock'

const AboutPage: React.FC = () => {
	const [pageContent, setPageContent] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchPageContent = async () => {
			try {
				const query = `*[_type == "page" && slug.current == "/about"][0]{
          _id,
          title,
          content[]{
            ...,
            downloads[]->,
            button->
          }
        }`

				const data = await (client as any).fetch(query)

				if (data && data.content) {
					setPageContent(data.content)
				}
			} catch (err) {
				console.error('Error fetching page content:', err)
				setError('Failed to load page content')
			} finally {
				setLoading(false)
			}
		}

		fetchPageContent()
	}, [])

	if (loading) {
		return (
			<div className='page-container'>
				<div className='loading'>Loading page content...</div>
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

	return (
		<div className='page-container'>
			<h1 className='page-title'>About</h1>

			{pageContent.length > 0 ? (
				<div className='page-builder-content'>
					{pageContent.map((block) => renderBlock(block))}
				</div>
			) : (
				<div className='cta-section'>
					<p>
						No content available. Please add content using the page builder in Sanity
						Studio.
					</p>
				</div>
			)}
		</div>
	)
}

export default AboutPage
