import UserService from './../../utilities/services/UserService';
import UploadService from './../../utilities/services/UploadService';
import RoleService from './../../utilities/services/RoleService';
import Helper from './../../utilities/Helper'

export default {
	name: "user",
	data() {
		return {
			userId: "",
			isFetching: true,
			isCreating: false,
			isUpdating: false,
			isUploadingImage: false,
			showCreateCategoryDialog: false,
			showCreateDialog: false,
			showUpdateDialog: false,
			updateIndex: -1,
			keySearch: "",
			data: {
				users: [],
				roles: []
			},
			user: {
				id: -1,
				imageFile: "",
				firstname: "",
				lastname: "",
				phone: "",
				email: "",
				password: "",
				role: "",
				photo: ""
			},
			category: {
				id: -1,
				name: ""
			},
			limits:[
				{
					val: 10,
					label: 10,
				},
				{
					val: 25,
					label: 25,
				},
				{
					val: 50,
					label: 50,
				}
			],
			pagination: {
				page: 0,
				size: 10,
				totalPage: 0,
				length: 0
			},
		}
	},
	created() {
		this.getUser(),
		this.getRole()
	},
	watch: {
		"$route.fullPath": function () {
			this.getUser();
		},
	},
	mounted() {

	},
	methods: {
		getRole() {
			this.isFetching = true
			this.userId = this.$cookies.get("userInfo").id
			let params = "?page=0&size=50"
			RoleService.getRole(params).then((response) => {
				this.isFetching = false
				if (response.response && response.response.status == 200) {
					this.data.roles = response.results
					if (response.results && response.results.length > 0) {
						this.user.role = response.results[0].id
					}
				}
			}).catch(err => { console.log(err) })
		},
		
		getUser() {
			let keySearch = this.$route.query.search
			let params = "?page=" + this.pagination.page + "&size=" + this.pagination.size
			if (keySearch) { params = params + "&query=" + keySearch }
			UserService.getUser(params).then((response) => {
				this.isFetching = false
				if (response.response && response.response.status == 200) {
					this.data.users = response.results
					this.pagination.totalPage = response.totalPage
					this.pagination.length = response.length
					this.pagination.page = response.page
				}
			}).catch(err => { console.log(err) })
		},

		async searchUser() {
			this.pagination.page = 0
			const query = Object.assign({}, this.$route.query)
			query.search = this.keySearch
			await this.$router.push({ name: 'user', query }).catch(() => { })
		},

		async validateBeforeCreate() {
			this.isCreating = true
			if (this.user.imageFile) {
				this.isUploadingImage = true
				this.uploadImage(this.user.imageFile)
			} else {
				this.createUser()
			}
		},

		async validateBeforeUpdate() {
			this.isUpdating = true
			if (this.user.imageFile) {
				this.isUploadingImage = true
				this.uploadImage(this.user.imageFile)
			} else {
				this.updateUser()
			}
		},

		createUser() {
			let msgValidation = this.validateBody()
			if (msgValidation == "OK") {
				this.isCreating = true
				let body = {
					"phone": this.user.phone,
					"email": this.user.email,
					"firstName": this.user.firstname,
					"lastName": this.user.lastname,
					"password": this.user.password,
					"role": {
						"id": this.user.role
					},
					"photo": this.user.photo
				}
				UserService.createUser(body).then((response) => {
					this.isCreating = false
					if (response.response && response.response.status == 200) {
						this.data.users.push(response.results)
						this.showCreateDialog = false;
					}
				}).catch(err => { console.log(err) })
			} else {
				this.isCreating = false
				alert(msgValidation);
			}
		},

		async uploadImage(file) {
			let formData = new FormData()
			formData.append("file", file)
			await UploadService.uploadMedia("product", formData)
				.then((response) => {
					if (response.response && response.response.status == 200) {
						this.isUploadingImage = false
						this.user.photo = response.results.path
						if(this.updateIndex > -1){
							this.updateUser()
						}else{
							this.createUser()
						}
					}
				})
		},

		updateUserStatus(index){
			this.updateIndex = index
			let user = this.data.users[this.updateIndex]
			user.user.enabled ? this.enableUser() : this.disableUser()
		},

		enableUser() {
			let userId = this.data.users[this.updateIndex].id
			UserService.enableUser(userId).then((response) => {
				this.isUpdating = false
				if (response && response.status == 200) {
					this.$set(this.data.users[this.updateIndex].user, 'enabled', true);
					this.hideDialog()
				}
			}).catch(err => { console.log(err) })
		},

		disableUser() {
			let userId = this.data.users[this.updateIndex].id
			UserService.disableUser(userId).then((response) => {
				this.isUpdating = false
				if (response && response.status == 200) {
					this.$set(this.data.users[this.updateIndex].user, 'enabled', false);
					this.hideDialog()
				}
			}).catch(err => { console.log(err) })
		},

		updateUser() {
			let msgValidation = this.validateUpdateBody()
			if (msgValidation == "OK") {
				this.isUpdating = true
				let body = {
					"id": this.user.id,
					"email": this.user.email,
					"firstName": this.user.firstname,
					"lastName": this.user.lastname,
					"role": {
						"id": this.user.role
					},
					"photo": this.user.photo
				}
				UserService.updateUser(body).then((response) => {
					this.isUpdating = false
					if (response.response && response.response.status == 200) {
						this.data.users[this.updateIndex] = response.results
						this.showUpdateDialog = false
						this.updateIndex = -1
					}
				}).catch(err => { console.log(err) })
			} else {
				this.isUpdating = false
				this.$toast.add({severity:'error', summary: 'Error Message', detail:msgValidation, life: 3000});
			}
		},

		openUpdateDialog(index) {
			this.updateIndex = index
			let user = this.data.users[index]
			this.user = {
				id: user.id,
				imageFile: "",
				firstname: user.firstName,
				lastname: user.lastName,
				phone: "",
				email: user.user.email,
				password: "",
				role: user.role.id,
				photo: user.photo
			}
			this.showUpdateDialog = true
		},

		validateBody() {
			if (!this.user.firstname) { return "First name is required." }
			if (!this.user.lastname) { return "Last name is required." }
			if (!this.user.email) { return "Email is required." }
			if (!this.user.phone) { return "Phone is required." }
			if (!this.user.password) { return "Password is required." }
			if (!this.user.role) { return "Role is required." }
			return "OK"
		},

		validateUpdateBody() {
			if (!this.user.firstname) { return "First name is required." }
			if (!this.user.lastname) { return "Last name is required." }
			if (!this.user.email) { return "Email is required." }
			if (!this.user.role) { return "Role is required." }
			return "OK"
		},

		chooseImage(e) {
			let images = e.target.files;
			if (images.length > 0) {
				this.category.image = ""
				for (let i = 0; i < images.length; i++) {
					var imageFile = images[i]
					Helper.compressImage(imageFile).then(file => {
						console.log(file)
						this.$set(this.user, 'imageFile', file);
					})
				}
			}
		},

		async changeLimit(){
			this.pagination.page = 0
			this.getUser()
		},

		fileToPath(file) { return window.URL.createObjectURL(file) },

		getFullPathImage(path) {
			return process.env.VUE_APP_BASE_URL + path
		},

		openCreateDialog() {
			this.showCreateDialog = true;
		},

		hideDialog() {
			this.isUpdating = false
			this.resetBody()
		},

		resetBody() {
			this.updateIndex = -1
		},

		onPage(event) {
			this.pagination.page = event.page
			this.getUser()
		},

	}
}