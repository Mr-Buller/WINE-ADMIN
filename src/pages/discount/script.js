import DiscountService from './../../utilities/services/DiscountService';
import Helper from './../../utilities/Helper'

export default {
	name: "discount",
	data() {
		return {
			isFetching: true,
			keySearch: "",
			data:{
				discounts: []
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
		this.getDiscount()
	},
	watch: {
		"$route.fullPath": function() {
			this.getDiscount();
		},
	},
	mounted() {

	},
	methods: {
		getDiscount() {
			this.keySearch = this.$route.query.query
			let params = "?page="+this.pagination.page+"&size="+this.pagination.size
			if(this.keySearch){ params = params+"&query="+this.keySearch }
            DiscountService.getDiscount(params).then((response) => {
				this.isFetching = false
                if (response.response && response.response.status == 200) {
					this.data.discounts = response.results
					this.pagination.totalPage = response.totalPage
					this.pagination.length = response.length
					this.pagination.page = response.page
                }
            }).catch(err => { console.log(err) })
		},
		
		async searchProduct(){
			this.pagination.page = 0
			const query = Object.assign({}, this.$route.query)
			query.query = this.keySearch
			await this.$router.push({ name: 'discount', query }).catch(() => {})
		},

		getFullPathImage(path){
			return process.env.VUE_APP_BASE_URL+path
		},

		formatPrice(price){
            return Helper.formatPrice(price)
        },

		onPage(event) {
			this.pagination.page = event.page
			this.getDiscount()
		},
	}
}