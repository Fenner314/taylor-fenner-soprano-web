import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.REACT_APP_SANITY_PROJECT_ID!
const dataset = process.env.REACT_APP_SANITY_DATASET!
const token = process.env.REACT_APP_SANITY_TOKEN!

if (!projectId || !dataset) {
	throw new Error(
		'Missing required Sanity environment variables. Please check your .env file.'
	)
}

export const client = createClient({
	projectId,
	dataset,
	useCdn: false,
	apiVersion: '2025-06-02',
	token,
})

// Set up the image URL builder
const builder = imageUrlBuilder(client)

export const urlForImage = (source: any) => {
	return builder.image(source)
}
