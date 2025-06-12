import Hero from '../components/blocks/Hero'
import Content from '../components/blocks/BlockContent'
import Downloads from '../components/blocks/Downloads'
import Banner from '../components/blocks/BlockBanner'
import Button from '../components/blocks/Button'
import MediaImage from '../components/blocks/MediaImage'
import MediaGrid from '../components/blocks/MediaGrid'
import VideoRecording from '../components/blocks/VideoRecording'
import BlockWrapper from '../components/blocks/BlockWrapper'
import { getCustomPageComponent } from './customPageComponents'

const renderBlock = (block: any) => {
	const renderContent = () => {
		switch (block._type) {
			case 'hero':
				return <Hero block={block} />

			case 'blockContent':
				return <Content block={block} />

			case 'downloads':
				return <Downloads block={block} />

			case 'blockBanner':
				return <Banner block={block} />

			case 'button':
				return <Button block={block} />

			case 'mediaImage':
				return <MediaImage block={block} />

			case 'mediaGrid':
				return <MediaGrid block={block} />

			case 'videoRecording':
				return <VideoRecording block={block} />

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
					<CustomComponent title={block.title} props={componentProps} />
				) : null

			default:
				console.warn(`Unknown block type: ${block._type}`)
				return null
		}
	}

	const content = renderContent()
	if (!content) return null

	// Determine if block should be full width
	const fullWidth = ['hero', 'blockBanner'].includes(block._type)

	console.log(block)
	return (
		<BlockWrapper
			key={block._key || block._id}
			type={block._type}
			fullWidth={fullWidth}
			styles={block.styles}
			label={block.label}
		>
			{content}
		</BlockWrapper>
	)
}

export default renderBlock
