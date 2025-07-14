import React from 'react'
import './Downloads.css'

interface DownloadsProps {
	block: {
		_key?: string
		_id?: string
		_type: 'downloads'
		title?: string
		items?: Array<{
			_id: string
			title: string
			description?: string
			link: string
			filename: string
		}>
	}
}

const Downloads: React.FC<DownloadsProps> = ({ block }) => {
	return (
		<div key={block._key || block._id} className='downloads-section'>
			{block.title && <h2 className='section-title'>{block.title}</h2>}
			{block.items && block.items.length > 0 && (
				<div className='downloads-grid'>
					{block.items.map((download) => (
						<div key={download._id} className='download-item'>
							<h4>
								<a
									href={download.link}
									className='download-link'
									target='_blank'
									rel='noopener noreferrer'
								>
									{download.title}
								</a>
							</h4>
							{download.description && <p>{download.description}</p>}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default Downloads
