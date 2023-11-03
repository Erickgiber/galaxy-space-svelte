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

				const { data: oldFollowingCurrent, error } = await supabase
					.from('followers')
					.select()
					.eq('username', profile.username)

				if (oldFollowingCurrent && oldFollowingCurrent.length > 0) {
					const { data: saveFollowersCurrent, error: errorSaveFollowersCurrent } = await supabase
						.from('followers')
						.update({
							following: [
								...(oldFollowingCurrent![0]?.following || []),
								{
									uuid: profile.uuid,
									username: profile.username,
									created_at: dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')
								}
							]
						})
						.eq('username', currentUser.username)
					return errorSaveFollowersCurrent ? false : true
				} else {
					const { data: saveFollowersCurrent, error: errorSaveFollowersCurrent } = await supabase
						.from('followers')
						.insert({
							username: currentUser.username,
							following: [
								{
									uuid: profile.uuid,
									username: profile.username,
									created_at: dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')
								}
							]
						})
					return errorSaveFollowersCurrent ? false : true
				}
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

				const { data: existTableCurrent, error: errorExistTableCurrent } = await supabase
					.from('followers')
					.select()
					.eq('username', currentUser.username)

				if (existTableCurrent && existTableCurrent.length > 0) {
					const { data: saveFollowersCurrent, error: errorSaveFollowersCurrent } = await supabase
						.from('followers')
						.update({
							following: [
								...(existTableCurrent![0]?.following || []),
								{
									uuid: profile.uuid,
									username: profile.username,
									created_at: dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')
								} as IFollower
							]
						})
						.eq('username', currentUser.username)
					return errorSaveFollowersCurrent ? false : true
				} else {
					const { data: saveFollowersCurrent, error: errorSaveFollowersCurrent } = await supabase
						.from('followers')
						.insert({
							username: currentUser.username,
							following: [
								{
									uuid: profile.uuid,
									username: profile.username,
									created_at: dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')
								} as IFollower
							]
						})
					return errorSaveFollowersCurrent ? false : true
				}
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

					const { data: oldFollowingCurrent, error: errorOldFollowingCurrent } = await supabase
						.from('followers')
						.select()
						.eq('username', currentUser.username)

					if (oldFollowingCurrent) {
						const existsFollowing = oldFollowingCurrent[0]?.following?.filter(
							(follower: IFollower) => follower.uuid === currentUser.uuid
						)

						const { data: removeFollowerCurrent, error: errorRemoveCurrent } = await supabase
							.from('followers')
							.update({
								following: existsFollowing
							})
							.eq('username', currentUser.username)

						return !errorRemoveCurrent ? false : true
					}
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
