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

import DynamicPage from './pages/DynamicPage'
import Navigation from './components/Navigation'
import { PagesProvider } from './contexts/PagesContext'
import { AnalyticsProvider } from './contexts/AnalyticsContext'
import Footer from './components/Footer'
import Layout from './components/layout/Layout'
import NotFound from './pages/NotFound'

function App() {
	useEffect(() => {
		emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY!)
	}, [])

	return (
		<PagesProvider>
			<Router>
				<AnalyticsProvider>
					<div className='App'>
						<Layout>
							<Routes>
								<Route path='/' element={<DynamicPage />} />
								<Route path='/:slug' element={<DynamicPage />} />
								<Route path='*' element={<NotFound />} />
							</Routes>
							<Navigation />
							<Footer />
						</Layout>
					</div>
				</AnalyticsProvider>
			</Router>
		</PagesProvider>
	)
}

export default App
