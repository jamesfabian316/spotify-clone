'use client'

import * as RadixSlider from '@radix-ui/react-slider'
import { formatTime } from '@/lib/utils'
import { useState } from 'react'

interface PlaybackSliderProps {
	value?: number
	onChange?: (value: number) => void
	duration?: number
	currentTime?: number
}

const PlaybackSlider: React.FC<PlaybackSliderProps> = ({
	value = 0,
	onChange,
	duration = 0,
	currentTime = 0,
}) => {
	const [hoverPosition, setHoverPosition] = useState<number | null>(null)
	const [isDragging, setIsDragging] = useState(false)

	const handleChange = (newValue: number[]) => {
		onChange?.(newValue[0])
	}

	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		const rect = event.currentTarget.getBoundingClientRect()
		const position = event.clientX - rect.left
		const percentage = position / rect.width
		const previewTime = percentage * duration
		setHoverPosition(previewTime)
	}

	const handleMouseLeave = () => {
		if (!isDragging) {
			setHoverPosition(null)
		}
	}

	return (
		<div className='flex items-center gap-x-2 w-full'>
			<span className='text-neutral-400 text-sm w-12'>{formatTime(currentTime)}</span>
			<div
				className='relative flex-1'
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
				<RadixSlider.Root
					className='
						relative 
						flex 
						items-center 
						select-none 
						touch-none 
						w-full 
						h-10
						cursor-pointer
						group
					'
					defaultValue={[0]}
					value={[value]}
					onValueChange={handleChange}
					max={duration}
					step={1}
					aria-label='Playback position'
					onPointerDown={() => setIsDragging(true)}
					onPointerUp={() => setIsDragging(false)}
				>
					<RadixSlider.Track
						className='
							bg-neutral-600 
							relative 
							grow 
							rounded-full 
							h-[3px]
							group-hover:h-[5px]
							transition
						'
					>
						<RadixSlider.Range
							className='
								absolute 
								bg-white 
								rounded-full 
								h-full
								group-hover:bg-green-500
							'
						/>
					</RadixSlider.Track>
					<RadixSlider.Thumb
						className='
							block
							w-4
							h-4
							bg-white
							rounded-full
							focus:outline-none
							transition
							cursor-grab
							active:cursor-grabbing
							hover:scale-110
							hover:bg-green-500
							opacity-0
							group-hover:opacity-100
						'
						aria-label='Seek'
					/>
				</RadixSlider.Root>
				{hoverPosition !== null && !isDragging && (
					<div
						className='absolute top-0 left-0 w-full h-full pointer-events-none'
						style={{ display: 'flex', alignItems: 'center' }}
					>
						<div
							className='absolute w-[2px] h-3 bg-white'
							style={{
								left: `${(hoverPosition / duration) * 100}%`,
								transform: 'translateX(-50%)',
							}}
						/>
						<div
							className='absolute bg-white text-black px-2 py-1 rounded text-sm'
							style={{
								left: `${(hoverPosition / duration) * 100}%`,
								transform: 'translateX(-50%) translateY(-100%)',
								top: '-8px',
							}}
						>
							{formatTime(hoverPosition)}
						</div>
					</div>
				)}
			</div>
			<span className='text-neutral-400 text-sm w-12'>{formatTime(duration)}</span>
		</div>
	)
}

export default PlaybackSlider
