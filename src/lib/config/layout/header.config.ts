export const HeaderConfig = {
	options: [
		{
			name: 'Menu',
			icon: 'ic:twotone-apps',
			customClass: '',
			onclick: (params?: any) => {
				console.log('Menu')
			}
		},
		{
			name: 'Notifications',
			icon: 'mingcute:notification-line',
			customClass: '',
			onclick: (params?: any) => {
				console.log('Notifications')
			}
		},
		{
			name: 'Dropdown',
			icon: 'eva:arrow-down-fill',
			customClass: '',
			onclick: (params?: any) => {
				console.log('Dropdown')
			}
		}
	]
}
