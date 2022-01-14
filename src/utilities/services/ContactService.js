import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const ContactService = {}

ContactService.getContact = async function (){
    return await axios.get(ApiContant.contact,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

ContactService.createContact = async function (body){
    return await axios.post(ApiContant.contact,
        body,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

export default ContactService;