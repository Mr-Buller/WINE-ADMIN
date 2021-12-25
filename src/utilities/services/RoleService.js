import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const RoleService = {}

RoleService.getRole = async function (params){
    return await axios.get(ApiContant.listRole+params,
        Service.headers())
    .then((response) => {
        return Service.validateError(response); 
    }).catch(function (error) {
        return error.response.data;
    })
};

RoleService.createRole = async function (body){
    return await axios.post(ApiContant.role, body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response); 
    }).catch(function (error) {
        return error.response.data;
    })
};

RoleService.updateRole = async function (body){
    return await axios.put(ApiContant.updateRole, body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response); 
    }).catch(function (error) {
        return error.response.data;
    })
};

export default RoleService;