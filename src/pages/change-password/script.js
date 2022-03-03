// import Helper from './../../utilities/Helper'
import UserService from './../../utilities/services/UserService'
// import UploadService from './../../utilities/services/UploadService'
import Toast from 'primevue/toast'

export default {
	name: "Change-Password",
	data() {
		return {
			isUpdating: false,
			currentPassword: "",
			newPassword: ""
		}
	},
	created() {

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
		validateBody(){
			if(!this.currentPassword){ return "Current password is required." }
			if(!this.newPassword){ return "New password is required." }
			return "OK"
		},
		changePassword(){
			let msgValidation = this.validateBody()
			if(msgValidation == "OK"){
				this.isUpdating = true
				let body = {
					currentPassword : this.currentPassword,
					newPassword : this.newPassword
				}
				UserService.changePassword(body).then((response) => {
					this.isUpdating = false
					if (response.response && response.response.status == 200) {
						this.$toast.add({severity:'success', summary: 'Success Message', detail: "Updated successfully", life: 2000});
					}else{
						this.$toast.add({severity:'error', summary: 'Error Message', detail: response.response.message, life: 2000});
					}
				})
			}else{
				this.$toast.add({severity:'error', summary: 'Error Message', detail: msgValidation, life: 2000});
			}
		}
	}
}