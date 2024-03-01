const navigation = () => {
  return [
    {
      title: 'Home',
      path: '/home-dashboard',
      icon: 'tabler:smart-home',
      role: ['member', 'shipper', 'admin']
    },
    {
      title: 'Quản lý order',
      path: '/admin-order',
      icon: 'tabler:clipboard-plus',
      role: ['admin']
    },
    {
      title: 'Quản lý món',
      path: '/admin-food',
      icon: 'tabler:clipboard-plus',
      role: ['admin']
    },
    {
      title: 'Shipper',
      path: '/shipper',
      icon: 'tabler:motorbike',
      role: ['shipper']
    },
    {
      title: 'Đơn của bạn',
      path: '/member-order',
      icon: 'tabler:clipboard-plus',
      role: ['member']
    }
  ]
}

export default navigation
