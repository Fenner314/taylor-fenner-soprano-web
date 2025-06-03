import React from 'react'

interface DownloadsProps {
	block: {
		_key?: string
		_id?: string
		_type: 'downloads'
		title?: string
		downloads?: Array<{
			_id: string
			title: string
			description?: string
			linkUrl: string
		}>
	}
}

const Downloads: React.FC<DownloadsProps> = ({ block }) => {
	return (
		<div key={block._key || block._id} className='downloads-section'>
			{block.title && <h2 className='section-title'>{block.title}</h2>}
			{block.downloads && block.downloads.length > 0 && (
				<div className='downloads-grid'>
					{block.downloads.map((download) => (
						<div key={download._id} className='download-item'>
							<h3>
								<a
									href={download.linkUrl}
									className='download-link'
									target='_blank'
									rel='noopener noreferrer'
								>
									{download.title}
								</a>
							</h3>
							{download.description && <p>{download.description}</p>}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default Downloads
