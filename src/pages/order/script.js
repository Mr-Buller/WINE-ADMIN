import Helper from './../../utilities/Helper'
import OrderService from './../../utilities/services/OrderService';

export default {
	name: "order",
	data() {
		return {
			isFetching: true,
			isGenerating: false,
			showReportDialog: false,
			currentDate: this.formatDate(Date),
			keySearch: "",
			data:{
				orders: [],
				exports: []
			},
			report:{
				startDate: "",
				endDate: "",
				orderStatus: ""
			},
			status:[
				{
					val: "",
					label: "All status"
				},
				{
					val: "PENDING",
					label: "Pending"
				},
				{
					val: "CONFIRM",
					label: "Confirm"
				},
				{
					val: "CANCEL",
					label: "Cancel"
				},
				{
					val: "COMPLETED",
					label: "Completed"
				}
			],
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

		validateBeforeReport(){
			let msgValidation = this.validateDate()
			if (msgValidation == "OK") {
				this.isGenerating = true
				let startDate = Helper.formatDate(this.report.startDate)
				let endDate = Helper.formatDate(this.report.endDate)
				let params = "?startDate="+startDate+"&endDate="+endDate
				if(this.report.orderStatus){ params = params+"&orderState="+this.report.orderStatus }
				OrderService.getOrderReport(params).then((response) => {
					if (response.response && response.response.status == 200) {
						this.data.exports = response.results
						setTimeout(() => {
							this.$refs.dataExport.exportCSV();
							this.isGenerating = false
							this.showReportDialog = false
						})
					}
				}).catch(err => { console.log(err) })
			}else{
				this.$toast.add({severity:'error', summary: 'Error Message', detail:msgValidation, life: 2000});
			}
		},

		validateDate() {
			if (!this.report.startDate) { return "Start date is required." }
			if (!this.report.endDate) { return "End date is required." }

			let endDate = Date.parse(this.report.endDate);
			let startDate = Date.parse(this.report.startDate);
			if (endDate < startDate) {
				return "End date must be bigger than start date."
			}

			return "OK"
		},

		formatDate(datetime){
			let date  = this.$moment().format(datetime | 'yyyy-mm-dd')
			return date.slice(0,10)
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