import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const CustomerService = {}

CustomerService.getCustomers = async function (param){
    return await axios.get(ApiContant.listCustomer+param,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

CustomerService.createCustomer = async function (body){
    return await axios.post(ApiContant.customerRegister,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

CustomerService.updateCustomer = async function (customerId,body) {
    return await axios.put(ApiContant.customer+"/"+customerId,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

export default CustomerService;