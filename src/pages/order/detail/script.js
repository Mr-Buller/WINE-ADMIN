import OrderService from './../../../utilities/services/OrderService';

export default {
	name: "order-detail",
	data() {
		return {
			isFetching: true,
			data:{
				order: ""
			}
		}
	},
	created() {
		this.getOrderDetail()
	},
	watch: {
		"$route.fullPath": function() {
			this.getOrderDetail();
		},
	},
	mounted() {

	},
	methods: {
		getOrderDetail() {
			let orderId = this.$route.params.id
            OrderService.getOrderDetail(orderId).then((response) => {
				this.isFetching = false
                if (response.response && response.response.status == 200) {
                    this.data.order = response.results
                }
            }).catch(err => { console.log(err) })
		},

		getSubtotal(qty,price,discount){
			qty = parseInt(qty)
			price = parseFloat(price)
			discount = parseInt(discount)
			let unitPrice = (qty * price)
			let priceDiscount = unitPrice * (discount/100)
			return unitPrice - priceDiscount
		},

		getFullPathImage(path){
			return process.env.VUE_APP_BASE_URL+path
		},
		
		fileToPath(file){ return window.URL.createObjectURL(file) }

	}
}