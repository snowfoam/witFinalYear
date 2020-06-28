export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/view/Login.vue')
  },
  {
    path: '/',
    name: '_home',
    component: () => import('@/view/Home'),
  },
  {
    path: '/401',
    name: 'error_401',
    component: () => import('@/view/errorPage/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    component: () => import('@/view/errorPage/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    component: () => import('@/view/errorPage/404.vue')
  }
]
