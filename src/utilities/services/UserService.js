import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const UserService = {}

UserService.getUserInfo = async function (){
    return await axios.get(ApiContant.userInfo,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

export default UserService;