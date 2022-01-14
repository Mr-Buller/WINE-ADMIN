import Vue from 'vue'
import VueRouter from 'vue-router'

import Dashboard from './pages/dashboard'
import Login from './pages/login'

import Role from './pages/role'

import Customer from './pages/customer'
import User from './pages/user'

import Product from './pages/product'
import CreateProduct from './pages/product/create'
import UpdateProduct from './pages/product/update'

import Category from './pages/category'
import Brand from './pages/brand'
import Slide from './pages/slide'

import Order from './pages/order'
import OrderDetail from './pages/order/detail'

import Country from './pages/country'
import ContactUs from './pages/contact-us'


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
  { path: '/product',name: 'product', component: Product, beforeEnter: isLoggedIn },
  { path: '/product/create',name: 'product-create', component: CreateProduct, beforeEnter: isLoggedIn },
  { path: '/product/update/:id',name: 'product-update', component: UpdateProduct, beforeEnter: isLoggedIn },
  { path: '/user',name: 'user', component: User, beforeEnter: isLoggedIn },
  { path: '/order',name: 'order', component: Order, beforeEnter: isLoggedIn },
  { path: '/order/:id',name: 'order-detail', component: OrderDetail, beforeEnter: isLoggedIn },
  { path: '/country',name: 'country', component: Country, beforeEnter: isLoggedIn },
  { path: '/contact-us',name: 'contact-us', component: ContactUs, beforeEnter: isLoggedIn },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router