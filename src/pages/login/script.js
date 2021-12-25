import LoginService from './../../utilities/services/LoginService'
// import BranchService from './../../utilities/services/BranchService'
import UserService from './../../utilities/services/UserService'
// import MenuService from './../../utilities/services/MenuService'

export default {
    name: "Login",
    data() {
        return {
            isLoading: false,
            show:false,
            data:{
                userInfo: ""
            },
            body: {
                username: "admin-dev",
                password: "123456"
            },
        }
    },
    components: {},
    created() { },
    methods: {
        onLogin() {
            if (this.body.username && this.body.password) {
                this.isLoading = true
                let body = {
                    "username": this.body.username,
                    "password": this.body.password
                }
                LoginService.login(body)
                    .then((response) => {
                        this.isLoading = false
                        if (response.response.status === 200) {
                            this.$cookies.set("token", response.results.token, "30d");
                            this.getUserInfo()
                        } else {
                            alert(response.response.message)
                        }
                    }).catch(e => console.log(e))
            } else {
                this.$toasted.show("Username and Password are required.")
            }
        },
        getUserInfo(){
            UserService.getUserInfo().then((response) => {
                if (response.response.status === 200) {
                    this.$cookies.set("userInfo", response.results)
                    location.reload()
                } else {
                    this.$toasted.show(response.message)
                }
            }).catch(e => console.log(e))
        }
    }
};