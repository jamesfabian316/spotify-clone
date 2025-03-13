import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { Song } from '@/types'
import { useUser } from '@/hooks/useUser'
import usePlayer from '@/hooks/usePlayer'

const useOnPlay = (songs: Song[]) => {
	const player = usePlayer()
	const router = useRouter()
	const { user } = useUser()

	const onPlay = useCallback(
		(id: string) => {
			if (!user) {
				return toast.error('Please login to play songs')
			}

			player.setId(id)
			player.setIds(songs.map((song) => song.id))
		},
		[user, player, songs]
	)

	return onPlay
}

export default useOnPlay
