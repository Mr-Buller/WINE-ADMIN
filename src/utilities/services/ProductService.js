import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const ProductService = {}

ProductService.getProduct = async function (params){
    return await axios.get(ApiContant.listProduct+params,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

ProductService.getProductDetail = async function (productId){
    return await axios.get(ApiContant.product+"/"+productId,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

ProductService.createProduct = async function (body){
    return await axios.post(ApiContant.product,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

ProductService.updateProduct = async function (body) {
    return await axios.put(ApiContant.updateProduct,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

ProductService.createProductVariant = async function (productId,body){
    return await axios.post(ApiContant.variant+"/"+productId,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

ProductService.updateProductVariant = async function (body) {
    return await axios.put(ApiContant.updateVariant,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

ProductService.getProductVariant = async function (productId){
    return await axios.get(ApiContant.variant+"/"+productId,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

export default ProductService;