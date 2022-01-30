import Helper from './../../utilities/Helper'
import OrderService from './../../utilities/services/OrderService';

export default {
	name: "order",
	data() {
		return {
			isFetching: true,
			keySearch: "",
			data:{
				orders: [],
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
					this.pagination.totalPage = response.totalPage
					this.pagination.length = response.length
					this.pagination.page = response.page
                }
            }).catch(err => { console.log(err) })
		},
		
		async onSearch(){
			this.pagination.page = 0
			const query = Object.assign({}, this.$route.query)
			query.search = this.keySearch
			await this.$router.push({ name: 'order', query }).catch(() => {})
		},

		formatPrice(price){
            return Helper.formatPrice(price)
		},

		exportCSV() {
			this.$refs.dataOrder.exportCSV();
		},
		
		onPage(event) {
			this.pagination.page = event.page
			this.getOrder()
		},
	}
}