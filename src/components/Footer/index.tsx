import React from 'react'
import './Footer.css'
import '../custom/Title/Title.css'
import { ReactComponent as FacebookIcon } from '../../assets/icons/facebook.svg'
import { ReactComponent as InstagramIcon } from '../../assets/icons/logo-instagram.svg'
import { ReactComponent as LinkedInIcon } from '../../assets/icons/logo-linkedin.svg'
import { ReactComponent as YouTubeIcon } from '../../assets/icons/logo-youtube.svg'

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear()

	return (
		<footer className='footer'>
			<div className='footer-content'>
				<div className='footer-main'>
					<div className='footer-title'>
						<h1>Taylor Fenner</h1>
						<div className='underline footer-underline'></div>
					</div>
					<div className='social-links'>
						<a
							href='https://www.facebook.com'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Facebook'
						>
							<FacebookIcon />
						</a>
						<a
							href='https://www.instagram.com'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='Instagram'
						>
							<InstagramIcon />
						</a>
						<a
							href='https://www.linkedin.com'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='LinkedIn'
						>
							<LinkedInIcon />
						</a>
						<a
							href='https://www.youtube.com'
							target='_blank'
							rel='noopener noreferrer'
							aria-label='YouTube'
						>
							<YouTubeIcon />
						</a>
					</div>
				</div>
				<div className='footer-copyright'>
					<p>&copy; Taylor Fenner {currentYear}. All rights reserved.</p>
					<p>
						Website created by{' '}
						<span className='fenner-studios'>
							<a
								href='https://fennerstudios.com'
								target='_blank'
								rel='noopener noreferrer'
							>
								Fenner Studios
							</a>
						</span>
					</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
