'use client'

import useSound from 'use-sound'
import { useEffect, useState, useRef } from 'react'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2'
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai'

import { Song } from '@/types'
import usePlayer from '@/hooks/usePlayer'

import LikeButton from './LikeButton'
import MediaItem from './MediaItem'
import Slider from './Slider'
import PlaybackSlider from './PlaybackSlider'

interface PlayerContentProps {
	song: Song
	songUrl: string
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
	const player = usePlayer()
	const [volume, setVolume] = useState(1)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const soundRef = useRef<ReturnType<typeof useSound>[1]['sound']>(null)

	const Icon = isPlaying ? BsPauseFill : BsPlayFill
	const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave

	const onPlayNext = () => {
		if (player.ids.length === 0) {
			return
		}

		const currentIndex = player.ids.findIndex((id) => id === player.activeId)
		const nextSong = player.ids[currentIndex + 1]

		if (!nextSong) {
			return player.setId(player.ids[0])
		}

		player.setId(nextSong)
	}

	const onPlayPrevious = () => {
		if (player.ids.length === 0) {
			return
		}

		const currentIndex = player.ids.findIndex((id) => id === player.activeId)
		const previousSong = player.ids[currentIndex - 1]

		if (!previousSong) {
			return player.setId(player.ids[player.ids.length - 1])
		}

		player.setId(previousSong)
	}

	const [play, { pause, sound }] = useSound(songUrl, {
		volume: volume,
		onplay: () => setIsPlaying(true),
		onend: () => {
			setIsPlaying(false)
			onPlayNext()
		},
		onpause: () => setIsPlaying(false),
		onload: () => {
			setIsLoading(false)
			setDuration(sound?.duration() || 0)
			soundRef.current = sound
		},
		format: ['mp3'],
	})

	useEffect(() => {
		if (sound) {
			sound.play()
			soundRef.current = sound
		}

		const interval = setInterval(() => {
			if (soundRef.current) {
				setCurrentTime(soundRef.current.seek())
			}
		}, 1000)

		return () => {
			clearInterval(interval)
			if (soundRef.current) {
				soundRef.current.unload()
			}
		}
	}, [sound])

	const handlePlay = () => {
		if (!isPlaying) {
			play()
		} else {
			pause()
		}
	}

	const toggleMute = () => {
		if (volume === 0) {
			setVolume(1)
		} else {
			setVolume(0)
		}
	}

	const handleSeek = (value: number) => {
		if (soundRef.current) {
			soundRef.current.seek(value)
			setCurrentTime(value)
		}
	}

	return (
		<div className='grid grid-cols-2 md:grid-cols-3 h-full items-center px-4'>
			<div className='flex w-full justify-start max-w-[480px]'>
				<div className='flex items-center gap-x-4 overflow-hidden'>
					<MediaItem data={song} />
					<LikeButton songId={song.id} />
				</div>
			</div>

			<div className='flex flex-col items-center justify-center w-full max-w-[722px] gap-y-1'>
				<div className='flex items-center justify-center gap-x-6 w-full'>
					<button
						onClick={onPlayPrevious}
						className='
							flex
							items-center
							justify-center
							text-neutral-400 
							cursor-pointer 
							hover:text-white 
							transition
							w-8
							h-8
						'
						style={{ opacity: isLoading ? 0.5 : 1 }}
					>
						<AiFillStepBackward size={24} />
					</button>
					<button
						onClick={handlePlay}
						className='
							flex 
							items-center 
							justify-center
							w-8
							h-8
							rounded-full 
							bg-white 
							cursor-pointer
							transition
							hover:scale-110
						'
						style={{ opacity: isLoading ? 0.5 : 1 }}
					>
						<Icon size={22} className='text-black ml-[1px]' />
					</button>
					<button
						onClick={onPlayNext}
						className='
							flex
							items-center
							justify-center
							text-neutral-400 
							cursor-pointer 
							hover:text-white 
							transition
							w-8
							h-8
						'
						style={{ opacity: isLoading ? 0.5 : 1 }}
					>
						<AiFillStepForward size={24} />
					</button>
				</div>
				<div className='w-full'>
					<PlaybackSlider
						value={currentTime}
						onChange={handleSeek}
						duration={duration}
						currentTime={currentTime}
					/>
				</div>
			</div>

			<div className='hidden md:flex w-full justify-end'>
				<div className='flex items-center gap-x-2 w-[120px]'>
					<VolumeIcon
						onClick={toggleMute}
						className='cursor-pointer text-neutral-400 hover:text-white transition'
						size={24}
					/>
					<Slider value={volume} onChange={(value) => setVolume(value)} />
				</div>
			</div>
		</div>
	)
}

export default PlayerContent
