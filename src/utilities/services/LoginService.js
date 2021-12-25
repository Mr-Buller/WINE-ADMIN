import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const LoginService = {}

LoginService.login = async function (body){
    return await axios.post(ApiContant.login, 
        body, 
        Service.headerWithoutToken())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

export default LoginService;