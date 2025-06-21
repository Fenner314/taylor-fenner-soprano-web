import React from 'react'

interface TestimonialProps {
	block: {
		_key?: string
		_id?: string
		_type: 'testimonial'
		quote: string
		name?: string
		label?: string
	}
}

const Testimonial: React.FC<TestimonialProps> = ({ block }) => {
	const { quote, name, label } = block
	return (
		<blockquote className='testimonial-block' data-label={label}>
			<p className='testimonial-quote'>{quote}</p>
			{name && <footer className='testimonial-name'>— {name}</footer>}
		</blockquote>
	)
}

export default Testimonial
