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

function App() {
	useEffect(() => {
		// Initialize EmailJS
		emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY!)
	}, [])

	return (
		<PagesProvider>
			<Router>
				<div className='App'>
					<Routes>
						<Route path='/' element={<DynamicPage />} />
						<Route path='/:slug' element={<DynamicPage />} />
						<Route path='*' element={<div className='error'>Page not found</div>} />
					</Routes>
					<Navigation />
				</div>
			</Router>
		</PagesProvider>
	)
}

export default App
