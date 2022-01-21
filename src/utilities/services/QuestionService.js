import axios from 'axios'
import Service from './MainService'
import ApiContant from './../constants/ApiContants'

const QuestionService = {}

QuestionService.getQuestion = async function (params){
    return await axios.get(ApiContant.listQuestion+params,
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

QuestionService.closeQuestion = async function (questionId) {
    return await axios.put(ApiContant.question+"/"+questionId+"/close",
        "",
        Service.headers())
    .then((response) => {
        return Service.validateError(response);
    }).catch(function (error) {
        return error.response.data;
    })
};

export default QuestionService;