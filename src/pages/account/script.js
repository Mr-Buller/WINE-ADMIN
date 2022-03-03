import Helper from './../../utilities/Helper'
import UserService from './../../utilities/services/UserService'
import UploadService from './../../utilities/services/UploadService'
import Toast from 'primevue/toast'

export default {
	name: "Account",
	data() {
		return {
			isFetching: true,
			isUpdating: false,
			isUploading: false,
			userInfo: "",
			imageFile: ""
		}
	},
	created() {
		this.getUserInfo()
	},
	watch: {
		"$route.fullPath": function () {

		},
	},
	components: {
		Toast
	},
	mounted() {

	},
	methods: {
		getUserInfo() {
			let userInfo = this.$cookies.get("userInfo")
			this.userInfo = userInfo
			if (userInfo) {
				this.userInfo = userInfo
			}
		},

		async validateBeforeUpdate(){
			let msgValidation = this.validateBody()
			if(msgValidation == "OK"){
				this.isUpdating = true
				if(this.imageFile){
					this.isUploading = true
					this.uploadImage(this.imageFile)
				}else{
					this.updateUserInfo()
				}
			}else{
				this.$toast.add({severity:'error', summary: 'Error Message', detail:msgValidation, life: 2000});
			}
		},
		
		async uploadImage(file){
            let formData = new FormData()
            formData.append("file", file)
            await UploadService.uploadMedia("brand",formData)
            .then((response) => {
                if(response.response && response.response.status == 200){
                    this.isUploading = false
					this.userInfo.photo = response.results.path
					this.updateUserInfo()
                }
            })
        },

		updateUserInfo() {
			let body = {
				"id": this.userInfo.id,
				"fullName": this.userInfo.firstName+" "+this.userInfo.lastName,
				"firstName": this.userInfo.firstName,
				"lastName": this.userInfo.lastName,
				"photo": this.userInfo.photo,
				"role": {
					"id": this.userInfo.role.id
				},
				"user": {
					"id": this.userInfo.user.id
				}
			}
			UserService.updateUser(body).then((response) => {
				this.isUpdating = false
				if (response.response && response.response.status == 200) {
					this.$cookies.set("userInfo", response.results)
					this.getUserInfo()
					this.$toast.add({severity:'success', summary: 'Success Message', detail: "Update successfully", life: 2000});
				}
			})
		},

		validateBody(){
			if(!this.userInfo.firstName){ return "First name is required." }
			if(!this.userInfo.lastName){ return "Last name is required." }
			if(!this.userInfo.role.id){ return "Role ID is required." }
			if(!this.userInfo.user.id){ return "User ID is required." }
			return "OK"
		},

		chooseImage(e) {
			let images = e.target.files;
			if (images.length > 0) {
				this.imageFile = ""
				for (let i = 0; i < images.length; i++) {
					var imageFile = images[i]
					Helper.compressImage(imageFile).then(file => {
						this.imageFile = file
					})
				}
			}
		},

		fileToPath(file) { return window.URL.createObjectURL(file) },

		getFullPathImage(path) {
			return process.env.VUE_APP_BASE_URL + path
		},
	}
}