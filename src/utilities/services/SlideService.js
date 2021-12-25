import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const SlideService = {}

SlideService.getSlide = async function (params){
    return await axios.get(ApiContant.listSlide+params,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

SlideService.createSlide = async function (body){
    return await axios.post(ApiContant.slide,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

SlideService.updateSlide = async function (body) {
    return await axios.post(ApiContant.slide,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

export default SlideService;