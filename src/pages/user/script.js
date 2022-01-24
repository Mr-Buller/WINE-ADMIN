import UserService from './../../utilities/services/UserService';

export default {
	name: "user",
	data() {
		return {
			isFetching: true,
			isCreatingCategory: false,
			isUpdating: false,
			showCreateCategoryDialog: false,
			showUpdateDialog: false,
			updateIndex: -1,
			keySearch: "",
			data:{
				users: []
			},
			category:{
				id: -1,
				name: ""
			},
			pagination:{
				page : 0,
				size : 10,
				totalPage: 0,
				length: 0
			},
		}
	},
	created() {
		this.getUser()
	},
	watch: {
		"$route.fullPath": function() {
			this.getUser();
		},
	},
	mounted() {

	},
	methods: {
		getUser() {
			let keySearch = this.$route.query.search
			let params = "?page="+this.pagination.page+"&size="+this.pagination.size
			if(keySearch){ params = params+"&query="+keySearch }
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
		
		async searchUser(){
			this.pagination.page = 0
			const query = Object.assign({}, this.$route.query)
			query.search = this.keySearch
			await this.$router.push({ name: 'user', query }).catch(() => {})
		},

		updateUser(){
			let user = this.data.users[this.updateIndex]
			user.user.enabled ? this.disableUser() : this.enableUser()
		},

		enableUser() {
			let userId  = this.data.users[this.updateIndex].id
			UserService.enableUser(userId).then((response) => {
				this.isUpdating = false
				if (response && response.status == 200) {
					this.$set(this.data.users[this.updateIndex].user, 'enabled', true);
					this.hideDialog()
				}
			}).catch(err => { console.log(err) })
		},

		disableUser() {
			let userId  = this.data.users[this.updateIndex].id
			UserService.disableUser(userId).then((response) => {
				this.isUpdating = false
				if (response && response.status == 200) {
					this.$set(this.data.users[this.updateIndex].user, 'enabled', false);
					this.hideDialog()
				}
			}).catch(err => { console.log(err) })
		},

		openUpdateDialog(index) {
			this.updateIndex = index
			this.showUpdateDialog = true
		},

		hideDialog() {
			this.showUpdateDialog = false
			this.isUpdating = false
			this.resetBody()
		},

		resetBody(){
			this.updateIndex = -1
		},

		getFullPathImage(path){
			return process.env.VUE_APP_BASE_URL+path
		},

		onPage(event) {
			this.pagination.page = event.page
			this.getUser()
		},

	}
}