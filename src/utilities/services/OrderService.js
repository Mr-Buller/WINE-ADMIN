import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const OrderService = {}

OrderService.getOrder = async function (params){
    return await axios.get(ApiContant.listOrder+params,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

OrderService.getOrderDetail = async function (orderId){
    return await axios.get(ApiContant.order+"/"+orderId,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

export default OrderService;