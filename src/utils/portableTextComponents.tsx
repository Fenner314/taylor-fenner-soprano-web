import { urlForImage } from '../lib/sanity'

export const portableTextComponents = {
	types: {
		image: ({ value }: any) => (
			<img
				src={urlForImage(value).url()}
				alt={value.alt || ''}
				style={{ maxWidth: '100%', height: 'auto', margin: '1rem 0' }}
			/>
		),
	},
	marks: {
		link: ({ children, value }: any) => (
			<a
				href={value.href}
				target='_blank'
				rel='noopener noreferrer'
				style={{ color: 'var(--primary)', textDecoration: 'underline' }}
			>
				{children}
			</a>
		),
	},
	block: {
		h1: ({ children }: any) => (
			<h1 style={{ color: 'var(--primary)', margin: '2rem 0 1rem 0' }}>
				{children}
			</h1>
		),
		h2: ({ children }: any) => (
			<h2 style={{ color: 'var(--primary)', margin: '1.5rem 0 1rem 0' }}>
				{children}
			</h2>
		),
		h3: ({ children }: any) => (
			<h3 style={{ color: 'var(--primary)', margin: '1rem 0 0.5rem 0' }}>
				{children}
			</h3>
		),
		blockquote: ({ children }: any) => (
			<blockquote
				style={{
					borderLeft: '4px solid var(--primary)',
					paddingLeft: '1rem',
					margin: '1rem 0',
					fontStyle: 'italic',
					background: 'var(--secondary)',
					padding: '1rem',
					borderRadius: '8px',
				}}
			>
				{children}
			</blockquote>
		),
		normal: ({ children }: any) => (
			<p style={{ marginBottom: '1rem' }}>{children}</p>
		),
	},
}
