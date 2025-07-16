import React, { useEffect } from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
} from 'react-router-dom'
import emailjs from '@emailjs/browser'
import './App.css'
import ScrollToTop from './components/ScrollToTop'

import DynamicPage from './pages/DynamicPage'
import Navigation from './components/Navigation'
import { PagesProvider, usePagesContext } from './contexts/PagesContext'
import { AnalyticsProvider } from './contexts/AnalyticsContext'
import NotFound from './pages/NotFound'
import Footer from './components/Footer'
import Layout from './components/layout/Layout'

function App() {
	return (
		<PagesProvider>
			<Router>
				<ScrollToTop />
				<AnalyticsProvider>
					<AppContent />
				</AnalyticsProvider>
			</Router>
		</PagesProvider>
	)
}

const AppContent = () => {
	const { isLoading, parallaxSections } = usePagesContext()

	useEffect(() => {
		emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY!)
	}, [])

	return (
		<div className='App'>
			<Navigation />
			<div className='parallax-container' id='parallax-container'>
				{parallaxSections.map((section) => {
					return (
						<div
							key={section.id}
							className='parallax-layer parallax-back'
							style={{ top: `${section.position}px` }}
							data-page={section.page}
						>
							{section.component}
						</div>
					)
				})}
				<div className={`parallax-layer ${isLoading ? '' : 'parallax-front'}`}>
					<Layout>
						<Routes>
							<Route path='/' element={<DynamicPage />} />
							<Route path='/:slug' element={<DynamicPage />} />
							<Route path='*' element={<NotFound />} />
						</Routes>
						<Footer />
					</Layout>
				</div>
			</div>
		</div>
	)
}

export default App
