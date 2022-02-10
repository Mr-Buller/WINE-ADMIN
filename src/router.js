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

import Discount from './pages/discount'
import CreateDiscount from './pages/discount/create'
import UpdateDiscount from './pages/discount/update'

import Category from './pages/category'
import Brand from './pages/brand'
import Slide from './pages/slide'

import Order from './pages/order'
import OrderDetail from './pages/order/detail'

import Country from './pages/country'
import ContactUs from './pages/contact-us'

import Question from './pages/question'


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
  { path: '/discount',name: 'discount', component: Discount, beforeEnter: isLoggedIn },
  { path: '/discount/create',name: 'discount-create', component: CreateDiscount, beforeEnter: isLoggedIn },
  { path: '/discount/update/:id',name: 'discount-update', component: UpdateDiscount, beforeEnter: isLoggedIn },
  { path: '/user',name: 'user', component: User, beforeEnter: isLoggedIn },
  { path: '/order',name: 'order', component: Order, beforeEnter: isLoggedIn },
  { path: '/order/:id',name: 'order-detail', component: OrderDetail, beforeEnter: isLoggedIn },
  { path: '/country',name: 'country', component: Country, beforeEnter: isLoggedIn },
  { path: '/contact-us',name: 'contact-us', component: ContactUs, beforeEnter: isLoggedIn },
  { path: '/question',name: 'question', component: Question , beforeEnter: isLoggedIn },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router