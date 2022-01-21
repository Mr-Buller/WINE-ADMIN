import OrderService from './../../../utilities/services/OrderService';
import Helper from './../../../utilities/Helper'

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

		confirmOrder() {
			let orderId = this.$route.params.id
            OrderService.confirmOrder(orderId).then((response) => {
                if (response.response && response.response.status == 200) {
                    this.data.order.orderState = "CONFIRM"
                }
            }).catch(err => { console.log(err) })
		},

		cancelOrder() {
			let orderId = this.$route.params.id
            OrderService.cancelOrder(orderId).then((response) => {
                if (response.response && response.response.status == 200) {
					this.data.order.orderState = "CANCEL"
                }
            }).catch(err => { console.log(err) })
		},

		completeOrder() {
			let orderId = this.$route.params.id
            OrderService.completedOrder(orderId).then((response) => {
                if (response.response && response.response.status == 200) {
                    this.data.order.orderState = "COMPLETE"
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
		
		fileToPath(file){ return window.URL.createObjectURL(file) },

		formatPrice(price){
            return Helper.formatPrice(price)
        },

	}
}