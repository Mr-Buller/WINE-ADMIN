import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const BrandService = {}

BrandService.getBrand = async function (params){
    return await axios.get(ApiContant.listBrand+params,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

BrandService.createBrand = async function (body){
    return await axios.post(ApiContant.brand,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

BrandService.updateBrand = async function (body) {
    return await axios.put(ApiContant.updateBrand,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

export default BrandService;