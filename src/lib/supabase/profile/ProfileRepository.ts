import type { ICurrentUser } from '$lib/store/currentUser'
import type { IFollower } from '$lib/types/follower.types'
import type { IProfile } from '$lib/types/profile.types'
import { imageCompress } from '$lib/utils/imageCompress'
import type { SupabaseClient } from '@supabase/supabase-js'
import { toast } from '@zerodevx/svelte-toast'
import { decode } from 'base64-arraybuffer'
import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'

export class ProfileRepository {
	photo = {
		change: async (profile: IProfile, photo: File, supabase: SupabaseClient) => {
			// * Compress photo
			const image = (await imageCompress(photo, 500, 90)).split(',')[1]

			// ? Insert photo to supabase bucket
			const { data, error } = await supabase.storage
				.from('photos')
				.upload(`avatars/${profile.username}/${uuid()}.png`, decode(image), {
					contentType: 'image/png'
				})

			if (!error) {
				const photo_url = `https://ufcvvchllbhbkfekutmt.supabase.co/storage/v1/object/public/photos/${data.path}`
				const { data: updateTable, error } = await supabase
					.from('profiles')
					.update({ photo_url })
					.eq('uuid', profile.uuid)

				return photo_url
			}

			return false
		}
	}

	cover_photo = {
		change: async (profile: IProfile, photo: File, supabase: SupabaseClient) => {
			// * Compress photo
			const image = (await imageCompress(photo, 1280, 90)).split(',')[1]

			// ? Insert photo to supabase bucket
			const { data, error } = await supabase.storage
				.from('photos')
				.upload(`covers_photo/${profile.username}/${uuid()}.png`, decode(image), {
					contentType: 'image/png'
				})

			if (!error) {
				const cover_photo_url = `https://ufcvvchllbhbkfekutmt.supabase.co/storage/v1/object/public/photos/${data.path}`
				const { data: updateTable, error } = await supabase
					.from('profiles')
					.update({ cover_photo_url })
					.eq('uuid', profile.uuid)

				return cover_photo_url
			}

			return false
		}
	}

	follow = {
		add: async (currentUser: ICurrentUser, profile: IProfile, supabase: SupabaseClient) => {
			const { data: oldFollowers, error } = await supabase
				.from('followers')
				.select()
				.eq('username', profile.username)

			// * if exists followers
			if (oldFollowers && oldFollowers.length > 0) {
				const existsFollow = oldFollowers[0]?.followers?.find(
					(follower: IFollower) => follower.uuid === currentUser.uuid
				)

				if (existsFollow) {
					return true
				}

				const { data: saveFollowers, error: errorSaveFollowers } = await supabase
					.from('followers')
					.update({
						followers: [
							...(oldFollowers![0]?.followers || []),
							{
								uuid: currentUser.uuid,
								username: currentUser.username,
								created_at: dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')
							}
						]
					})
					.eq('username', profile.username)

				return errorSaveFollowers ? false : true
			} else {
				const { data: saveFollowers, error: errorSaveFollowers } = await supabase
					.from('followers')
					.insert({
						username: profile.username,
						followers: [
							...(oldFollowers![0]?.followers || []),
							{
								uuid: currentUser.uuid,
								username: currentUser.username,
								created_at: dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')
							} as IFollower
						]
					})
				return errorSaveFollowers ? false : true
			}
		},
		remove: async (currentUser: ICurrentUser, profile: IProfile, supabase: SupabaseClient) => {
			const { data: oldFollowers, error } = await supabase
				.from('followers')
				.select()
				.eq('username', profile.username)

			// * if exists followers
			if (oldFollowers && oldFollowers.length > 0) {
				const existsFollow = oldFollowers[0]?.followers?.filter(
					(follower: IFollower) => follower.uuid === currentUser.uuid
				)

				if (existsFollow) {
					const newFollowers = oldFollowers[0]?.followers?.filter(
						(follower: IFollower) => follower.uuid !== currentUser.uuid
					)

					const { data: removeFollower, error: errorRemove } = await supabase
						.from('followers')
						.update({
							followers: newFollowers
						})
						.eq('username', profile.username)

					return !removeFollower ? false : true
				} else {
					toast.push('You not follow this user', {
						theme: {
							'--toastBackground': '#e74c3c',
							'--toastProgressBackground': '#c0392b'
						}
					})
					return false
				}
			} else {
				toast.push('This user not contains followers', {
					theme: {
						'--toastBackground': '#e74c3c',
						'--toastProgressBackground': '#c0392b'
					}
				})
				return false
			}
		}
	}
}
