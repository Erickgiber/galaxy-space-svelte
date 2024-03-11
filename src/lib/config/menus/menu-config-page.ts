interface IOptionMenuConfig {
	id: number
	name: string
	description: string
	href: string
	icon: string
	className?: string
	width: number
}

export const MENU_CONFIG_PAGE = () => {
	let options: IOptionMenuConfig[] = [
		{
			id: 1,
			name: 'Account',
			description: 'Configure your public name and more',
			href: '/space/settings/account',
			icon: 'ion:settings-outline',
			width: 20
		},
		{
			id: 2,
			name: 'Profile',
			description: 'Change your profile picture, add decoration to your profile and more',
			href: '/space/settings/profile',
			icon: 'lucide:user-2',
			width: 20
		},
		{
			id: 3,
			name: 'Privacy',
			description: 'Choose if you want to be followed or how you want your profile privacy to work',
			href: '/space/settings/privacy',
			icon: 'ic:outline-privacy-tip',
			width: 20
		},
		{
			id: 4,
			name: 'App',
			description: 'Set the app theme and more',
			href: '/space/settings/app',
			icon: 'tdesign:application',
			width: 20
		}
	]

	return options
}