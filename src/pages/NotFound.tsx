import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
	console.log('not found.')

	return (
		<div
			className='not-found-container'
			style={{
				minHeight: '80vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				overflow: 'hidden',
				padding: '2rem',
			}}
		>
			<div
				style={{
					fontSize: '6rem',
					fontFamily: 'var(--font-serif)',
					color: 'var(--primary)',
					margin: '0',
					opacity: 0.9,
					display: 'flex',
					alignItems: 'center',
					gap: '0.5rem',
				}}
			>
				404
			</div>

			<p
				style={{
					fontSize: '1.2rem',
					color: 'var(--text-dark)',
					textAlign: 'center',
					marginTop: '1rem',
					fontFamily: 'var(--font-serif)',
					opacity: 0.8,
				}}
			>
				Oops! This page seems to have wandered off...
			</p>

			<p
				style={{
					fontSize: '1rem',
					color: 'var(--text-dark)',
					opacity: 0.6,
					maxWidth: '400px',
					textAlign: 'center',
					margin: '0.5rem 0 2rem',
				}}
			>
				(It's probably just taking a little break somewhere)
			</p>

			<Link
				to='/'
				style={{
					textDecoration: 'none',
					backgroundColor: 'var(--primary)',
					color: 'white',
					padding: '0.8rem 1.6rem',
					borderRadius: '20px',
					fontSize: '1rem',
					transition: 'transform 0.2s ease',
				}}
				className='home-button'
			>
				Take me home
			</Link>

			{/* Floating dots */}
			{[...Array(6)].map((_, i) => (
				<div
					key={i}
					className='floating-dot'
					style={{
						position: 'absolute',
						width: '8px',
						height: '8px',
						backgroundColor: 'var(--primary)',
						borderRadius: '50%',
						opacity: 0.15,
						animation: `float ${4 + i}s ease-in-out infinite`,
						animationDelay: `${i * 1.5}s`,
						top: `${30 + Math.random() * 40}%`,
						left: `${30 + Math.random() * 40}%`,
					}}
				/>
			))}

			<style>
				{`
					@keyframes float {
						0%, 100% {
							transform: translate(0, 0);
						}
						50% {
							transform: translate(0, -20px);
						}
					}

					.home-button:hover {
						transform: scale(1.05);
					}

					.floating-dot {
						pointer-events: none;
						user-select: none;
					}
				`}
			</style>
		</div>
	)
}

export default NotFound
