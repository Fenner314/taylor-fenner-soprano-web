import React from 'react'
import { usePagesContext } from '../../contexts/PagesContext'
import Loading from '../blocks/Loading'

interface LayoutProps {
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { isLoading, error } = usePagesContext()

	if (isLoading) {
		return <Loading text='Loading page...' size='large' fullscreen />
	}

	if (error) {
		return (
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
				<h2>Error</h2>
				<p>{error}</p>
			</div>
		)
	}

	return <>{children}</>
}

export default Layout
