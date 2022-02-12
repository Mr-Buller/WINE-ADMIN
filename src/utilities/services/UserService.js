import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const UserService = {}

UserService.createUser = async function (body){
    return await axios.post(ApiContant.user,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

UserService.getUserInfo = async function (){
    return await axios.get(ApiContant.userInfo,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

UserService.getUser = async function (params){
    return await axios.get(ApiContant.listUser+params,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

UserService.disableUser = async function (userId){
    return await axios.put(ApiContant.user+"/"+userId+"/disable","",
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

UserService.enableUser = async function (userId){
    return await axios.put(ApiContant.user+"/"+userId+"/enable","",
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

export default UserService;