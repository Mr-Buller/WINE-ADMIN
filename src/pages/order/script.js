import CategoryService from './../../utilities/services/CategoryService';
import OrderService from './../../utilities/services/OrderService';

export default {
	name: "order",
	data() {
		return {
			isFetching: true,
			isCreatingCategory: false,
			isUpdatingCategory: false,
			showCreateCategoryDialog: false,
			showUpdateCategoryDialog: false,
			updateCategoryIndex: -1,
			keySearch: "",
			data:{
				orders: [],
				categories: []
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
		this.getOrder()
	},
	watch: {
		"$route.fullPath": function() {
			this.getOrder();
		},
	},
	mounted() {

	},
	methods: {
		getOrder() {
			let keySearch = this.$route.query.search
			let params = "?page="+this.pagination.page+"&size="+this.pagination.size
			if(keySearch){ params = params+"&query="+keySearch }
            OrderService.getOrder(params).then((response) => {
				this.isFetching = false
                if (response.response && response.response.status == 200) {
                    this.data.orders = response.results
                }
            }).catch(err => { console.log(err) })
		},
		
		async searchCategory(){
			this.pagination.page = 0
			const query = Object.assign({}, this.$route.query)
			query.search = this.keySearch
			await this.$router.push({ name: 'order', query }).catch(() => {})
		},

		async validateBeforeCreateCategory(){
			this.isCreatingCategory = true
            this.createCategory()
		},
		
		async validateBeforeUpdateCategory(){
			this.isUpdatingCategory = true
			this.isCreatingCategory = true
            this.updateCategory()
        },

		createCategory(){
			let msgValidation = this.validateBodyCategory()
			if(msgValidation == "OK"){
				this.isCreatingCategory = true
				let body = {
					name: this.category.name,
					status: true
				}
				CategoryService.createCategory(body).then((response) => {
					this.isCreatingCategory = false
					if (response.response && response.response.status == 200) {
						this.data.categories.push(response.results)
						this.hideDialog()
					}
				}).catch(err => { console.log(err) })
			}else{
				this.$toasted.show(msgValidation);
			}
		},

		updateCategory() {
			let msgValidation = this.validateBodyCategory()
			if(msgValidation == "OK"){
				this.isUpdatingCategory = true
				let body = {
					id: this.category.id,
					name: this.category.name,
					status: true
				}
				CategoryService.updateCategory(body).then((response) => {
					this.isUpdatingCategory = false
					if (response.response && response.response.status == 200) {
						this.data.categories[this.updateCategoryIndex] = response.results
						this.hideDialog()
					}
				}).catch(err => { console.log(err) })
			}else{
				this.$toasted.show(msgValidation);
			}
		},

		validateBodyCategory(){
			if(!this.category.name){ return "Name is required." }
			return "OK"
		},

		openCreateCategoryDialog() {
			this.showCreateCategoryDialog = true;
		},

		openUpdateCategoryDialog(index) {
			this.updateCategoryIndex = index
			let category = this.data.categories[index]
			this.category = {
				id: category.id,
				name: category.name,
				status: category.status
			}
			this.showUpdateCategoryDialog = true
		},

		hideDialog() {
			this.showCreateCategoryDialog = false
			this.showUpdateCategoryDialog = false
			this.isCreatingCategory = false
			this.isUpdatingCategory = false
			this.resetBodyCategory()
		},

		resetBodyCategory(){
			this.updateCategoryIndex = -1
			this.category = {
				name: ""
			}
		},
		
		fileToPath(file){ return window.URL.createObjectURL(file) },
	}
}