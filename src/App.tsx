import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

// Import pages
import Home from './pages/Home'
import About from './pages/About'
import Media from './pages/Media'
import Contact from './pages/Contact'
// import Studio from './components/Studio'

function App() {
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
					<Route path='/' element={<Home />} />
					<Route path='/about' element={<About />} />
					<Route path='/media' element={<Media />} />
					<Route path='/contact' element={<Contact />} />
					{/* <Route path='/admin' element={<Studio />} /> */}
				</Routes>
			</div>
		</Router>
	)
}

export default App
