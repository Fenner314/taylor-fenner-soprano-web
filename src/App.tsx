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
// import Studio from './components/Studio'

function App() {
	useEffect(() => {
		// Initialize EmailJS
		emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY!)
	}, [])

	return (
		<Router>
			<div className='App'>
				{/* <nav>
					<ul>
						<li>
							<Link to='/'>Home</Link>
						</li>
						<li>
							<Link to='/about'>About</Link>
						</li>
						<li>
							<Link to='/media'>Media</Link>
						</li>
						<li>
							<Link to='/contact'>Contact</Link>
						</li>
					</ul>
				</nav> */}

				<Routes>
					<Route path='/' element={<DynamicPage />} />
					{/* <Route path='/' element={<Navigate to='/' replace />} /> */}
					<Route path='/:slug' element={<DynamicPage />} />
					<Route path='*' element={<div className='error'>Page not found</div>} />
				</Routes>
			</div>
		</Router>
	)
}

export default App
