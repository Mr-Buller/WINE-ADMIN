import RoleService from './../../utilities/services/RoleService';

export default {
	name: "user-management-role",
	data() {
		return {
			isFetching: true,
			isSubmitted: false,
			isCreatingRole: false,
			isUpdatingRole: false,
			showCreateRoleDialog: false,
			showUpdateRoleDialog: false,
			updateRoleIndex: -1,
			data:{
				roles: []
			},
			body:{
				id: -1,
				name: "",
				status: "true"
			},
			roleStatus:[
				{value:"true", name:"Enabled"},
				{value:"false", name:"Disabled"}
			]
		}
	},
	created() {
		this.getRole()
	},
	mounted() {

	},
	methods: {
		getRole() {
			this.isFetching = true
			let params = "?page=0&size=50"
            RoleService.getRole(params).then((response) => {
				this.isFetching = false
                if (response.response && response.response.status == 200) {
                    this.data.roles = response.results
                }
            }).catch(err => { console.log(err) })
		},

		createRole(){
			let msgValidation = this.validateBodyRole()
			if(msgValidation == "OK"){
				this.isCreatingRole = true
				let body = {
					name: this.body.name,
					enabled: this.body.status.trim() == "true" ? true : false
				}
				RoleService.createRole(body).then((response) => {
					this.isCreatingRole = false
					if (response.response && response.response.status == 200) {
						this.data.roles.push(response.results)
						this.hideDialog()
					}
				}).catch(err => { console.log(err) })
			}else{
				this.$toasted.show(msgValidation);
			}
		},

		updateRole(){
			let msgValidation = this.validateBodyRole()
			if(msgValidation == "OK"){
				this.isUpdatingRole = true
				let body = {
					id: this.body.id,
					name: this.body.name,
					enabled: this.body.status.trim() == "true" ? true : false
				}
				RoleService.updateRole(body).then((response) => {
					this.isUpdatingRole = false
					if (response.response && response.response.status == 200) {
						this.data.roles[this.updateRoleIndex] = response.results
						this.hideDialog()
					}
				}).catch(err => { console.log(err) })
			}else{
				this.$toasted.show(msgValidation);
			}
		},

		validateBodyRole(){
			if(!this.body.name){ return "Name is required." }
			if(!this.body.status){ return "Status is required."}
			return "OK"
		},

		openCreateRoleDialog() {
			this.showCreateRoleDialog = true
		},

		openUpdateRoleDialog(roleIndex) {
			this.updateRoleIndex = roleIndex
			let role = this.data.roles[roleIndex]
			this.body = {
				id: role.id,
				name: role.name,
				status: role.enabled ? 'true' : 'false'
			},
			this.showUpdateRoleDialog = true
		},

		hideDialog() {
			this.showCreateRoleDialog = false
			this.showUpdateRoleDialog = false
			this.isSubmitted = false
			this.updateRoleIndex = -1
			this.body = {
				id: -1,
				name: "",
				status: "true"
			}
		},
	}
}