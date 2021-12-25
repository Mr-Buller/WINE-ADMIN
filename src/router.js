import Vue from 'vue'
import VueRouter from 'vue-router'

import Dashboard from './pages/dashboard'
import Login from './pages/login'

// Role
import Role from './pages/role'

// Contact management
import Customer from './pages/customer'

// Product management
import Category from './pages/category'

// Brand
import Brand from './pages/brand'

// Slide
import Slide from './pages/slide'


const isLoggedIn = (to, from, next) => {
	if (!Vue.$cookies.get('token')) {
    return router.push({ name: 'login' });
  }
  return next();
}

const isNotLoggedIn = (to, from, next) => {
	if (Vue.$cookies.get('token')) {
    return router.push({ name: 'dashboard' });
  }
  return next();
}

Vue.use(VueRouter)

const routes = [
  { path: '/',name: 'dashboard', component: Dashboard, beforeEnter: isLoggedIn },
  { path: '/login',name: 'login', component: Login, beforeEnter: isNotLoggedIn },
  { path: '/role',name: 'role', component: Role, beforeEnter: isLoggedIn },
  { path: '/customer',name: 'customer', component: Customer, beforeEnter: isLoggedIn },
  { path: '/category',name: 'category', component: Category, beforeEnter: isLoggedIn },
  { path: '/brand',name: 'brand', component: Brand, beforeEnter: isLoggedIn },
  { path: '/slide',name: 'slide', component: Slide, beforeEnter: isLoggedIn },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router