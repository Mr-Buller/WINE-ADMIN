import CountryService from './../../utilities/services/CountryService';

export default {
	name: "country",
	data() {
		return {
			isFetching: true,
			isCreating: false,
			isUpdating: false,
			showCreateDialog: false,
			showUpdateDialog: false,
			updateIndex: -1,
			keySearch: "",
			data:{
				countries: []
			},
			country:{
				id: -1,
				name: "",
				enabled: false
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
		this.getCountry()
	},
	watch: {
		"$route.fullPath": function() {
			this.getCountry();
		},
	},
	mounted() {

	},
	methods: {
		getCountry() {
			let keySearch = this.$route.query.search
			let params = "?page="+this.pagination.page+"&size="+this.pagination.size
			if(keySearch){ params = params+"&query="+keySearch }
            CountryService.getCountry(params).then((response) => {
				this.isFetching = false
                if (response.response && response.response.status == 200) {
					this.data.countries = response.results
					this.pagination.totalPage = response.totalPage
					this.pagination.length = response.length
					this.pagination.page = response.page
                }
            }).catch(err => { console.log(err) })
		},
		
		async searchCountry(){
			this.pagination.page = 0
			const query = Object.assign({}, this.$route.query)
			query.search = this.keySearch
			await this.$router.push({ name: 'country', query }).catch(() => {})
		},
		
		async validateBeforeUpdate(){
			this.isUpdating = true
			this.isCreating = true
            this.updateCountry()
        },

		createCountry(){
			let msgValidation = this.validateBody()
			if(msgValidation == "OK"){
				this.isCreating = true
				let body = {
					name: this.country.name,
					status: true
				}
				CountryService.createCountry(body).then((response) => {
					this.isCreating = false
					if (response.response && response.response.status == 200) {
						this.data.countries.push(response.results)
						this.hideDialog()
					}
				}).catch(err => { console.log(err) })
			}else{
				this.$toasted.show(msgValidation);
			}
		},

		updateCountryStatus(index){
			this.updateIndex = index
			let country = this.data.countries[index]
			this.country = {
				id: country.id,
				name: country.name,
				enabled: country.enabled
			}
			this.updateCountry()
		},

		updateCountry() {
			let msgValidation = this.validateBody()
			if(msgValidation == "OK"){
				this.isUpdating = true
				let body = {
					id: this.country.id,
					name: this.country.name,
					enabled: this.country.enabled
				}
				CountryService.updateCountry(body).then((response) => {
					this.isUpdating = false
					if (response.response && response.response.status == 200) {
						this.data.countries[this.updateIndex] = response.results
						this.hideDialog()
					}
				}).catch(err => { console.log(err) })
			}else{
				this.$toasted.show(msgValidation);
			}
		},

		validateBody(){
			if(!this.country.name){ return "Country name is required." }
			return "OK"
		},

		openCreateDialog() {
			this.showCreateDialog = true;
		},

		openUpdateDialog(index) {
			this.updateIndex = index
			let country = this.data.countries[index]
			this.country = {
				id: country.id,
				name: country.name,
				enabled: country.enabled
			}
			this.showUpdateDialog = true
		},

		hideDialog() {
			this.showCreateDialog = false
			this.showUpdateDialog = false
			this.isUploadingImage = false
			this.isCreating = false
			this.isUpdating = false
			this.resetBody()
		},

		resetBody(){
			this.updateIndex = -1
			this.country = {
				name: ""
			}
		},

		getFullPathImage(path){
			return process.env.VUE_APP_BASE_URL+path
		},

		onPage(event) {
			this.pagination.page = event.page
			this.getCountry()
		},
	}
}