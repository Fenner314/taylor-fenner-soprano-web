import React, { useState } from 'react'
import { CustomComponentProps } from '../../../utils/customPageComponents'
import Button from '../../blocks/Button'

const ContactForm: React.FC<CustomComponentProps> = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// Handle form submission
		console.log('Contact form submitted:', formData)
		// You could integrate with an email service here
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	return (
		<div className='custom-contact-form' style={{ margin: '2rem 0' }}>
			<div className='cta-section'>
				<h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
					Get in Touch
				</h3>
				<form onSubmit={handleSubmit}>
					<div style={{ marginBottom: '1rem' }}>
						<input
							type='text'
							name='name'
							placeholder='Your Name'
							value={formData.name}
							onChange={handleChange}
							required
							style={{
								width: '100%',
								padding: '0.75rem',
								border: '1px solid var(--bg-gray-2)',
								borderRadius: '8px',
								fontSize: '1rem',
							}}
						/>
					</div>
					<div style={{ marginBottom: '1rem' }}>
						<input
							type='email'
							name='email'
							placeholder='Your Email'
							value={formData.email}
							onChange={handleChange}
							required
							style={{
								width: '100%',
								padding: '0.75rem',
								border: '1px solid var(--bg-gray-2)',
								borderRadius: '8px',
								fontSize: '1rem',
							}}
						/>
					</div>
					<div style={{ marginBottom: '1rem' }}>
						<textarea
							name='message'
							placeholder='Your Message'
							value={formData.message}
							onChange={handleChange}
							required
							rows={4}
							style={{
								width: '100%',
								padding: '0.75rem',
								border: '1px solid var(--bg-gray-2)',
								borderRadius: '8px',
								fontSize: '1rem',
								resize: 'vertical',
							}}
						/>
					</div>
					<Button
						block={{
							_type: 'button',
							text: 'Send Message',
							url: '#',
							buttonType: 'contained',
							colorScheme: 'primary',
							size: 'medium',
						}}
					/>
				</form>
			</div>
		</div>
	)
}

export default ContactForm
