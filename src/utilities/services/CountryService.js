import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const CountryService = {}

CountryService.getCountry = async function (params){
    return await axios.get(ApiContant.listCountry+params,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

CountryService.createCountry = async function (body){
    return await axios.post(ApiContant.country,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

CountryService.updateCountry = async function (body) {
    return await axios.put(ApiContant.updateCountry,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

export default CountryService;