const baseUrl = process.env.VUE_APP_BASE_URL
const v1 = '/v1/api/admin'

const ApiContant = {
    // Auth
    login : baseUrl + v1 + '/auth/login',

    // Product
    listProduct : baseUrl + v1 + '/product/list',
    product : baseUrl + v1 + '/product',
    updateProduct : baseUrl + v1 + '/product/update',

    // Variant
    variant : baseUrl + v1 + '/product/product-variant/product',
    updateVariant : baseUrl + v1 + '/product/product-variant/combination/update',

    // Branch
    listBrand: baseUrl + v1 + '/brand/list',
    brand: baseUrl + v1 + '/brand',
    updateBrand: baseUrl + v1 + '/brand/update',

    // User
    userInfo: baseUrl + v1 + '/auth/user-info',

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

    // Slide
    slide: baseUrl + v1 + '/slide',
    listSlide: baseUrl + v1 + '/slide/list',

    //upload
    uploadImage: baseUrl+'/storage/upload-image-',
    deleteImage: baseUrl + v1 + '/drop-box/delete',
}

export default ApiContant;