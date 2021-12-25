import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const CategoryService = {}

CategoryService.getCategories = async function (param){
    return await axios.get(ApiContant.listCategory+param,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

CategoryService.createCategory = async function (body){
    return await axios.post(ApiContant.category,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

CategoryService.updateCategory = async function (body) {
    return await axios.put(ApiContant.updateCategory,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

export default CategoryService;