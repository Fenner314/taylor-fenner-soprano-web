import Hero from '../components/blocks/Hero'
import Content from '../components/blocks/BlockContent'
import Downloads from '../components/blocks/Downloads'
import Banner from '../components/blocks/BlockBanner'
import Button from '../components/blocks/Button'
import MediaImage from '../components/blocks/MediaImage'
import VideoRecording from '../components/blocks/VideoRecording'
import { getCustomPageComponent } from './customPageComponents'

const renderBlock = (block: any) => {
	switch (block._type) {
		case 'hero':
			return <Hero key={block._key || block._id} block={block} />

		case 'blockContent':
			return <Content key={block._key || block._id} block={block} />

		case 'downloads':
			return <Downloads key={block._key || block._id} block={block} />

		case 'blockBanner':
			return <Banner key={block._key || block._id} block={block} />

		case 'button':
			return <Button key={block._key || block._id} block={block} />

		case 'mediaImage':
			return <MediaImage key={block._key || block._id} block={block} />

		case 'videoRecording':
			return <VideoRecording key={block._key || block._id} block={block} />

		case 'customComponent':
			const CustomComponent = getCustomPageComponent(block.component)
			let componentProps = {}
			if (block.props) {
				try {
					componentProps = JSON.parse(block.props)
				} catch (err) {
					console.warn('Invalid JSON in component props:', block.props)
				}
			}
			return CustomComponent ? (
				<CustomComponent
					key={block._key || block._id}
					title={block.title}
					props={componentProps}
				/>
			) : null

		default:
			console.warn(`Unknown block type: ${block._type}`)
			return null
	}
}

export default renderBlock
