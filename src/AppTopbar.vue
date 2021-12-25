<template>
	<div class="layout-topbar">
		<button class="p-link layout-menu-button" @click="onMenuToggle">
			<span class="pi pi-bars"></span>
		</button>
		<div class="layout-topbar-icons">
			<button @click="logout" class="p-link">
				<span class="layout-topbar-item-text">User</span>
				<span class="layout-topbar-icon pi pi-user"></span>
			</button>
		</div>
	</div>
</template>

<script>
import MainService from './utilities/services/MainService'

export default {
	name: "AppTopbar",
	data(){
		return{
			ani: false,
			currentBusinessId: -1,
			currentBusiness: "",
			submitted: false,
			businessDialog: false,
			userInfo: "",
			branches: [],
			popupshow : {
				profile: false,
				sidebar: false,
			},
			data:{
				businessTypes: []
			},
			body:{
				branchId : 0,
			},
			createBusiness: {
				name: "",
				type: ""
			}
		}
	},
	created(){
	},
    methods: {
        onMenuToggle(event) {
            this.$emit('menu-toggle', event);
		},
		logout(){
			MainService.logout()
		}
    }
}
</script>