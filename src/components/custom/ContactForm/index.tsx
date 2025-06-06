import React, { useState, useRef } from 'react'
import { CustomComponentProps } from '../../../utils/customPageComponents'
import Button from '../../blocks/Button'
import emailjs from '@emailjs/browser'
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
	const recaptchaRef = useRef<ReCAPTCHA>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		setStatus({ type: null, message: '' })

		try {
			// Get reCAPTCHA token
			const token = await recaptchaRef.current?.executeAsync()
			if (!token) {
				throw new Error('Please complete the reCAPTCHA verification')
			}

			await emailjs.send(
				process.env.REACT_APP_EMAILJS_SERVICE_ID!,
				process.env.REACT_APP_EMAILJS_TEMPLATE_ID!,
				{
					name: formData.name,
					email: formData.email,
					message: formData.message,
					to_name: 'Taylor Fenner',
					'g-recaptcha-response': token,
				},
				process.env.REACT_APP_EMAILJS_PUBLIC_KEY
			)

			setStatus({
				type: 'success',
				message: 'Thank you! Your message has been sent.',
			})
			setFormData({ name: '', email: '', message: '' }) // Reset form
			recaptchaRef.current?.reset() // Reset reCAPTCHA
		} catch (error) {
			console.error('Failed to send email:', error)
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
							text: isSubmitting ? 'Sending...' : 'Send Message',
							url: '#',
							buttonType: 'contained',
							colorScheme: 'primary',
							size: 'medium',
						}}
						type='submit'
					/>
				</form>
			</div>
		</div>
	)
}

export default ContactForm
