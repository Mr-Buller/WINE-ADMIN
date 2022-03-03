const baseUrl = process.env.VUE_APP_BASE_URL
const v1 = '/v1/api/admin'

const ApiContant = {
    // Auth
    login : baseUrl + v1 + '/auth/login',
    changePassword : baseUrl + v1 + '/auth/change-password',

    // Product
    listProduct : baseUrl + v1 + '/product/list',
    product : baseUrl + v1 + '/product',
    updateProduct : baseUrl + v1 + '/product/update',

    // Discount
    listDiscount : baseUrl + v1 + '/discount/list',
    discount : baseUrl + v1 + '/discount',
    updateDiscount : baseUrl + v1 + '/discount/update',

    // Variant
    variant : baseUrl + v1 + '/product/product-variant/product',
    updateVariant : baseUrl + v1 + '/product/product-variant/combination/update',

    // Branch
    listBrand: baseUrl + v1 + '/brand/list',
    brand: baseUrl + v1 + '/brand',
    updateBrand: baseUrl + v1 + '/brand/update',

    // User
    userInfo: baseUrl + v1 + '/auth/user-info',
    listUser: baseUrl + v1 + '/user-detail/list',
    user : baseUrl + v1 + '/user-detail',
    updateUser: baseUrl + v1 + '/user-detail/update',

    // Category
    listCategory: baseUrl + v1 + '/category/list',
    category: baseUrl + v1 + '/category',
    updateCategory: baseUrl + v1 + '/category/update',

    // Role
    role : baseUrl + v1 + '/role',
    updateRole : baseUrl + v1 + '/role/update',
    listRole : baseUrl + v1 + '/role/list',

    // Employee
    employee: baseUrl + v1 + '/employee',

    // Customer
    listCustomer: baseUrl + v1 + '/customer/list',
    customer: baseUrl + v1 + '/customer',
    customerRegister: baseUrl +'/v1/api/customer/register',
    customerReport: baseUrl + v1 + '/customer/report',

    // Slide
    slide: baseUrl + v1 + '/slide',
    listSlide: baseUrl + v1 + '/slide/all',

    // Order
    order: baseUrl + v1 + '/order',
    listOrder: baseUrl + v1 + '/order/list',
    orderReport : baseUrl + v1 + '/order/report',

    //upload
    uploadImage: baseUrl+'/storage/upload-image-',
    deleteImage: baseUrl + v1 + '/drop-box/delete',

    // Country
    country: baseUrl + v1 + '/country',
    listCountry: baseUrl + v1 + '/country/list',
    updateCountry: baseUrl + v1 + '/country/update',

    // Contact
    contact: baseUrl + v1 + '/contact-us',

    // Question
    question: baseUrl + v1 + '/question',
    listQuestion: baseUrl + v1 + '/question/list',
}

export default ApiContant;