import React, { useState, useRef } from 'react'
import { CustomComponentProps } from '../../../utils/customPageComponents'
import Button from '../../blocks/Button'
import ReCAPTCHA from 'react-google-recaptcha'
import './ContactForm.css'

interface ContactFormProps extends CustomComponentProps {
	emailAddress?: string
}

const ContactForm: React.FC<ContactFormProps> = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	})
	const [status, setStatus] = useState<{
		type: 'success' | 'error' | null
		message: string
	}>({
		type: null,
		message: '',
	})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isVerifying, setIsVerifying] = useState(false)
	const recaptchaRef = useRef<ReCAPTCHA>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		setIsVerifying(true)
		setStatus({ type: null, message: '' })

		try {
			// Get reCAPTCHA token
			const token = await recaptchaRef.current?.executeAsync()
			console.log('token', token)
			setIsVerifying(false)
			if (!token) {
				throw new Error('Please complete the reCAPTCHA verification')
			}

			const response = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					access_key: process.env.REACT_APP_WEB3_FORMS_API_KEY,
					name: formData.name,
					email: formData.email,
					message: formData.message,
					subject: 'New Contact Form Submission - Taylor Fenner',
				}),
			})

			const result = await response.json()
			console.log('result', result)

			if (result.success) {
				setStatus({
					type: 'success',
					message: 'Thank you! Your message has been sent.',
				})
				setFormData({ name: '', email: '', message: '' }) // Reset form
				recaptchaRef.current?.reset() // Reset reCAPTCHA
			} else {
				throw new Error(result.message || 'Something went wrong. Please try again.')
			}
		} catch (error) {
			console.error('Failed to send message:', error)
			setStatus({
				type: 'error',
				message:
					error instanceof Error
						? error.message
						: 'Sorry, something went wrong. Please try again later.',
			})
		} finally {
			setIsSubmitting(false)
			setTimeout(() => {
				setStatus({ type: null, message: '' })
			}, 8000)
		}
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
		<div className='custom-contact-form'>
			<div className='cta-section'>
				<h3>Get in Touch</h3>
				{status.type && (
					<div
						className={`form-message ${status.type}`}
						style={{
							padding: '1rem',
							marginBottom: '1rem',
							borderRadius: '8px',
							backgroundColor:
								status.type === 'success' ? 'var(--bg-success)' : 'var(--bg-error)',
							color:
								status.type === 'success' ? 'var(--text-success)' : 'var(--text-error)',
						}}
					>
						{status.message}
					</div>
				)}
				<form onSubmit={handleSubmit} className='contact-form'>
					<div style={{ marginBottom: '1rem' }}>
						<input
							type='text'
							name='name'
							placeholder='Your Name'
							value={formData.name}
							onChange={handleChange}
							required
							className='contact-form-input font-serif'
							disabled={isSubmitting}
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
							className='contact-form-input font-serif'
							disabled={isSubmitting}
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
							className='contact-form-textarea font-serif'
							disabled={isSubmitting}
						/>
					</div>
					<div style={{ marginBottom: '1rem' }}>
						<ReCAPTCHA
							ref={recaptchaRef}
							size='invisible'
							sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY!}
						/>
					</div>
					<Button
						block={{
							_type: 'button',
							text: isVerifying
								? 'Verifying...'
								: isSubmitting
									? 'Sending...'
									: 'Send Message',
							url: '#',
							buttonType: 'contained',
							colorScheme: 'primary',
							size: 'medium',
							customStyles:
								isVerifying || isSubmitting
									? {
											backgroundColor: { hex: 'var(--disabled)' },
											textColor: { hex: 'var(--text-disabled)' },
										}
									: undefined,
							onClick:
								isVerifying || isSubmitting ? (e) => e.preventDefault() : undefined,
						}}
						type='submit'
					/>
				</form>
			</div>
		</div>
	)
}

export default ContactForm
