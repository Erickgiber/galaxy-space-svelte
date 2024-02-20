import type { ICurrentUser } from '$lib/store/currentUser'
import { postForEdit } from '$lib/store/postForEdit'
import type { IPost } from '$lib/types/post.types'
import { copyText } from '$lib/utils/copyText'
import { v4 } from 'uuid'

const TYPE_POST = {
	DOWNLOAD: 'DOWNLOAD',
	REMOVE: 'REMOVE',
	EDIT: 'EDIT',
	COPY_TEXT: 'COPY_TEXT'
}

const FOR_POST = {
	TEXT: 'TEXT',
	IMAGE: 'IMAGE',
	VIDEO: 'VIDEO'
}

export const MENU_POST_OPTIONS = (post: IPost, user: ICurrentUser) => {
	const isImage = post.image_url && post.image_url.length > 3
	const isSomeUser = user.username === post.user.username
	const className = ''

	let options = [
		{
			id: 1,
			name: 'Edit',
			icon: 'bxs:edit',
			width: 17,
			className,
			type: TYPE_POST.EDIT,
			for: FOR_POST.TEXT,
			someUser: true,
			onClick: () => postForEdit.set({ enable: true, post, edit: true, remove: false })
		},
		{
			id: 2,
			name: 'Remove',
			icon: 'pajamas:remove-all',
			width: 17,
			className,
			type: TYPE_POST.REMOVE,
			for: FOR_POST.TEXT,
			someUser: true,
			onClick: () => postForEdit.set({ enable: true, post, edit: false, remove: true })
		},
		{
			id: 3,
			name: 'Download',
			icon: 'octicon:download-16',
			width: 17,
			className,
			type: TYPE_POST.DOWNLOAD,
			for: FOR_POST.IMAGE,
			someUser: false,
			onClick: async () => {
				const response = await fetch(post.image_url)
				const blob = await response.blob()

				const url = URL.createObjectURL(blob)

				const a = document.createElement('a')
				a.href = url
				a.download = `${post.text ?? v4()}`
				a.click()
				a.remove()

				URL.revokeObjectURL(url)
			}
		},
		{
			id: 4,
			name: 'Copy text',
			icon: 'ph:copy',
			width: 17,
			className,
			type: TYPE_POST.COPY_TEXT,
			for: FOR_POST.TEXT,
			someUser: true,
			onClick: () => copyText(post.text)
		}
	]

	if (!isImage) {
		options = options.filter((option) => option.for !== FOR_POST.IMAGE)
	}

	if (!isSomeUser) {
		options = options.filter((option) => option.someUser !== true)
	}

	if (!post.text) {
		options = options.filter((option) => option.type !== TYPE_POST.COPY_TEXT)
	}

	return options
}
