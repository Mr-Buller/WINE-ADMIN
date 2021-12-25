import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const UploadService = {}

UploadService.uploadMedia = async function (type,formData) {
    return await axios.post(ApiContant.uploadImage+type,
        formData,
        Service.headersFormData())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

export default UploadService;