import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
	const { pathname } = useLocation()

	useEffect(() => {
		// Force scroll to top using multiple methods
		window.scrollTo({
			top: 0,
			left: 0,
			// @ts-ignore
			behavior: 'instant',
		})

		// Also try scrolling the document
		document.documentElement.scrollTo({
			top: 0,
			left: 0,
			// @ts-ignore
			behavior: 'instant',
		})

		// And the body
		document.body.scrollTo({
			top: 0,
			left: 0,
			// @ts-ignore
			behavior: 'instant',
		})

		document.getElementById('parallax-container')?.scrollTo({
			top: 0,
			left: 0,
			// @ts-ignore
			behavior: 'instant',
		})
	}, [pathname])

	return null
}

export default ScrollToTop
