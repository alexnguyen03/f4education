import Index from 'views/user/Home.js';
import Cart from 'views/user/Cart.js';

var UserRoutes = [
	{
		path: '/index',
		name: 'Trang chủ',
		icon: 'ni ni-tv-2 text-primary',
		component: <Index />,
		layout: '',
	},
	{
		path: '/course',
		name: 'Khóa học',
		icon: 'ni ni-planet text-blue',
		component: <Cart />,
		layout: '',
	},
	{
		path: '/course',
		name: 'Danh mục',
		icon: 'ni ni-planet text-blue',
		component: <Cart />,
		layout: '',
	},
];
export default UserRoutes;