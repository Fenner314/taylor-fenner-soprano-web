import React from 'react'
import { usePagesContext } from '../../contexts/PagesContext'
import Loading from '../blocks/Loading'

interface LayoutProps {
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { isLoading, error, lastUpdated } = usePagesContext()

	if (isLoading && !lastUpdated) {
		return <Loading text='Loading page...' size='large' fullscreen />
	}

	if (error && !lastUpdated) {
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

	return (
		<>
			{children}
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
					}}
				>
					<Loading size='small' text='' />
					<span>Updating content...</span>
				</div>
			)}
		</>
	)
}

export default Layout
