'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionContext } from '@supabase/auth-helpers-react'

import { useUser } from '@/hooks/useUser'
import useAuthModal from '@/hooks/useAuthModal'
import useUploadModal from '@/hooks/useUploadModal'
import useAuth from '@/hooks/useAuth'

import Button from '@/components/Button'

const AccountContent = () => {
	const router = useRouter()
	const { user } = useUser()
	const authModal = useAuthModal()
	const uploadModal = useUploadModal()
	const { signOut } = useAuth()

	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!user) {
			router.replace('/')
		}
	}, [user, router])

	const onLogout = async () => {
		setLoading(true)
		try {
			await signOut()
			router.replace('/')
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	if (!user) {
		return (
			<div className='flex flex-col gap-y-4'>
				<p>Please login to view your account.</p>
				<Button className='bg-white' onClick={authModal.onOpen}>
					Login
				</Button>
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-y-4'>
			<div className='flex flex-col gap-y-2'>
				<h2 className='text-2xl font-bold'>Account</h2>
				<p className='text-neutral-400'>Welcome back, {user.email}</p>
			</div>
			<div className='flex flex-col gap-y-4'>
				<Button className='bg-white' onClick={uploadModal.onOpen}>
					Upload a song
				</Button>
				<Button className='bg-white' onClick={onLogout} disabled={loading}>
					Logout
				</Button>
			</div>
		</div>
	)
}

export default AccountContent
