import type { IProfile } from '$lib/types/profile.types'
import { imageCompress } from '$lib/utils/imageCompress'
import type { SupabaseClient } from '@supabase/supabase-js'
import { decode } from 'base64-arraybuffer'
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
}
