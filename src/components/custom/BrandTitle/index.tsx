import React from 'react'
import './BrandTitle.css'

interface BrandTitleProps {
	isMainTitle?: boolean
	firstName?: string
	lastName?: string
	className?: string
}

const BrandTitle: React.FC<BrandTitleProps> = ({
	isMainTitle = true,
	firstName = 'CHRISTOPHER',
	lastName = 'RODRIGUEZ',
	className = '',
}) => {
	const initial = firstName.charAt(0)

	return (
		<h1
			className={`home-title-container ${className} ${isMainTitle ? 'main-title' : ''}`}
		>
			<span className='initial'>{initial}</span>
			<div className='name-container'>
				<span>{firstName.slice(1)}</span>
				<span>{lastName}</span>
			</div>
		</h1>
	)
}

export default BrandTitle
