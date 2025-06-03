import React from 'react'

interface EventProps {
	block: {
		_key?: string
		_id?: string
		_type: 'event'
		title: string
		date?: string
		description?: string
		location?: string
		button?: {
			url: string
			text: string
		}
	}
}

const Event: React.FC<EventProps> = ({ block }) => {
	return (
		<div
			key={block._key || block._id}
			className='event-item'
			style={{ margin: '2rem 0' }}
		>
			<h3 className='media-title'>{block.title}</h3>
			{block.date && (
				<p style={{ color: 'var(--secondary)', fontWeight: '600' }}>
					{new Date(block.date).toLocaleDateString()}
				</p>
			)}
			{block.location && (
				<p>
					<strong>Location:</strong> {block.location}
				</p>
			)}
			{block.description && <p>{block.description}</p>}
			{block.button && (
				<a
					href={block.button.url}
					className='cta-button'
					style={{ marginTop: '1rem', display: 'inline-block' }}
				>
					{block.button.text}
				</a>
			)}
		</div>
	)
}

export default Event
