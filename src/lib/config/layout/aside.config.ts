import type { SupabaseClient } from '@supabase/supabase-js'

export const AsideConfig = {
	routes: [
		{
			name: 'Home',
			icon: 'solar:home-smile-linear',
			customClass: '',
			href: '/space'
		},
		{
			name: 'Profile',
			icon: 'lucide:user-2',
			customClass: '',
			href: '/space/profile'
		},
		{
			name: 'My contacts',
			icon: 'ic:twotone-connect-without-contact',
			customClass: '',
			href: '/space/contacts'
		},
		{
			name: 'Services',
			icon: 'ant-design:api-outlined',
			customClass: '',
			href: '/space/services'
		},
		{
			name: 'Settings',
			icon: 'solar:settings-linear',
			customClass: '',
			href: '/space/settings'
		},
		{
			name: 'Wallet',
			icon: 'ph:wallet',
			customClass: '',
			href: '/space/wallet'
		}
	]
}
