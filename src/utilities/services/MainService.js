import VueCookies from 'vue-cookies'

const MainService = {}

MainService.headers = function (){
    let token = VueCookies.get("token");
    if(token){
        let header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            }
        }
        return header;
    }else{ MainService.logout() }
};

MainService.headersFormData = function (){
    let token = VueCookies.get("token");
    if(token){
        let header = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer '+token
            }
        }
        return header;
    }
};

MainService.headerWithoutToken = function (){
    let header = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return header;
}

MainService.validateError = function (data) {
    if(data && data.status === 401){
        MainService.logout();
    }
    return data.data;
};

MainService.logout = function (){
    VueCookies.remove("token");
    VueCookies.remove("userInfo")
    VueCookies.remove("business")
    VueCookies.remove("listBranch")
    VueCookies.remove("branch")
    location.reload();
};

export default MainService;