import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ReactComponent as HomeIcon } from '../../assets/icons/home.svg'
import { ReactComponent as PersonIcon } from '../../assets/icons/person.svg'
import { ReactComponent as ImagesIcon } from '../../assets/icons/images.svg'
import { ReactComponent as MailIcon } from '../../assets/icons/mail.svg'
import { ReactComponent as CalendarIcon } from '../../assets/icons/calendar.svg'
import { ReactComponent as PageIcon } from '../../assets/icons/document.svg'
import { usePagesContext } from '../../contexts/PagesContext'
import './Navigation.css'

const defaultNavItems = [
	{
		icon: <HomeIcon />,
		label: 'Home',
		path: '/',
	},
	{
		icon: <PersonIcon />,
		label: 'About',
		path: '/about',
	},
	{
		icon: <ImagesIcon />,
		label: 'Media',
		path: '/media',
	},
	{
		icon: <CalendarIcon />,
		label: 'Events',
		path: '/events',
	},
	{
		icon: <MailIcon />,
		label: 'Contact',
		path: '/contact',
	},
]

const Navigation = () => {
	const location = useLocation()
	const path = location.pathname === '/' ? 'home' : location.pathname.slice(1)
	const { pages, isLoading } = usePagesContext()
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	// Use default nav items while loading or if no pages are found
	const navItems =
		!isLoading && pages.length > 0
			? pages
					.map((page) => ({
						icon: defaultNavItems.find(
							(item) =>
								item.path ===
								(page.slug?.current === '/'
									? '/'
									: `/${page.slug?.current.split('/')[1]}`)
						)?.icon || <PageIcon />,
						label: page.title,
						path:
							page.slug?.current === '/'
								? '/'
								: `/${page.slug?.current.split('/')[1]}`,
						index: page.index,
					}))
					.sort((a, b) => a.index - b.index)
			: defaultNavItems

	const activeIndex = navItems.findIndex((item) =>
		item.path === '/' ? path === 'home' : item.path.slice(1) === path
	)

	const isValidPage = activeIndex !== -1

	const indicatorStyle = isValidPage
		? isMobile
			? {
					left: `${activeIndex * (100 / navItems.length)}%`,
					width: `${100 / navItems.length}%`,
				}
			: {
					top: `calc(50% - ${(navItems.length * 76) / 2}px + ${activeIndex * 76}px)`,
					height: '64px',
					'--indicator-height': '64px',
				}
		: {
				display: 'none',
			}

	return (
		<nav className='mobile-nav'>
			<div className='nav-indicator-container'>
				<div className='nav-indicator' style={indicatorStyle} />
			</div>
			<div className='nav-items'>
				{navItems.map((item) => (
					<Link
						key={item.label}
						to={item.path}
						className={`nav-item ${
							(item.path === '/' ? path === 'home' : item.path.slice(1) === path)
								? 'active'
								: ''
						}`}
					>
						{item.icon}
						<span className='nav-label'>{item.label}</span>
					</Link>
				))}
			</div>
		</nav>
	)
}

export default Navigation
