export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/view/Login')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/view/Register')
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/view/Home'),
  },
  {
    path: '/subjects',
    name: 'subjects',
    component: () => import('@/view/Subjects'),
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('@/view/Courses'),
  },
  {
    path: '/questions',
    name: 'questions',
    component: () => import('@/view/Questions'),
  },
  {
    path: '/students',
    name: 'students',
    component: () => import('@/view/Students'),
  },
  {
    path: '/exams',
    name: 'exams',
    component: () => import('@/view/Exams'),
  },
  {
    path: '/401',
    name: 'error_401',
    component: () => import('@/view/errorPage/401')
  },
  {
    path: '/500',
    name: 'error_500',
    component: () => import('@/view/errorPage/500')
  },
  {
    path: '*',
    name: 'error_404',
    component: () => import('@/view/errorPage/404')
  }
]
