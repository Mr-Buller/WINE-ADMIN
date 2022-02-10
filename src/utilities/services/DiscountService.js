import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const DiscountService = {}

DiscountService.getDiscount = async function (params){
    return await axios.get(ApiContant.listDiscount+params,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

DiscountService.getDiscountDetail = async function (discountId){
    return await axios.get(ApiContant.discount+"/"+discountId,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

DiscountService.createDiscount = async function (body) {
    return await axios.post(ApiContant.discount,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

DiscountService.updateDiscount = async function (body) {
    return await axios.put(ApiContant.updateDiscount,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

export default DiscountService;