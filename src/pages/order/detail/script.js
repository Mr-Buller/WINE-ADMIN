import OrderService from './../../../utilities/services/OrderService';
import Helper from './../../../utilities/Helper'

export default {
	name: "order-detail",
	data() {
		return {
			isFetching: true,
			isUpdating: false,
			showUpdateStatusDialog: false,
			updateOrderStatus: "",
			rejectRemark: "",
			data:{
				order: "",
				orderHistories: []
			},
		}
	},
	created() {
		this.getOrderDetail()
		this.getOrderHistory()
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

		getOrderHistory() {
			let orderId = this.$route.params.id
            OrderService.getOrderHistory(orderId).then((response) => {
                if (response.response && response.response.status == 200) {
                    this.data.orderHistories = response.results
                }
            }).catch(err => { console.log(err) })
		},

		confirmUpdateStatus(){
			this.isUpdating = true
			if(this.updateOrderStatus == 'confirm'){this.confirmOrder()}
			if(this.updateOrderStatus == 'cancel'){this.cancelOrder()}
			if(this.updateOrderStatus == 'complete'){this.completeOrder()}
		},

		confirmOrder() {
			let orderId = this.$route.params.id
            OrderService.confirmOrder(orderId).then((response) => {
				this.isUpdating = false
                if (response.response && response.response.status == 200) {
					this.data.order.orderState = "CONFIRM"
					this.showUpdateStatusDialog = false
                }
            }).catch(err => { console.log(err) })
		},

		cancelOrder() {
			let orderId = this.$route.params.id
			let body = {
				comment: this.rejectRemark
			}
            OrderService.cancelOrder(body,orderId).then((response) => {
				this.isUpdating = false
                if (response.response && response.response.status == 200) {
					this.data.order.orderState = "CANCEL"
					this.showUpdateStatusDialog = false
                }
            }).catch(err => { console.log(err) })
		},

		completeOrder() {
			let orderId = this.$route.params.id
            OrderService.completedOrder(orderId).then((response) => {
				this.isUpdating = false
                if (response.response && response.response.status == 200) {
					this.data.order.orderState = "COMPLETE"
					this.showUpdateStatusDialog = false
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

		displayUpdateOrderStatusDialog(orderStatus){
			this.updateOrderStatus = orderStatus
			this.showUpdateStatusDialog = true
		},
		
		fileToPath(file){ return window.URL.createObjectURL(file) },

		formatPrice(price){
            return Helper.formatPrice(price)
        },
	}
}