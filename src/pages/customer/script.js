import CustomerService from './../../utilities/services/CustomerService';
import Helper from './../../utilities/Helper'
import Paginator from 'primevue/paginator';

export default {
	name: "customer",
	data() {
		return {
			isFetching: true,
			showDetailDialog: false,
			showCreateCustomerDialog: false,
			showUpdateCustomerDialog: false,
			isCreatingCustomer: false,
			isUpdating: false,
			isGenerating: false,
			showReportDialog: false,
			currentDate: this.formatDate(Date),
			updateCustomerIndex: -1,
			updateStatusIndex: -1,
			keySearch: "",
			data:{
				customer: "",
				customers: [],
				customerAddress: [],
				roles: [],
				exports: []
			},
			pagination:{
				page : 0,
				size : 25,
				totalPage: 0,
				length: 0
			},
			report:{
				startDate: "",
				endDate: ""
			},
			limits:[
				{
					val: 10,
					label: 10,
				},
				{
					val: 25,
					label: 25,
				},
				{
					val: 50,
					label: 50,
				}
			],
			customer:{
				id: -1,
				firstName: "",
				lastName: "",
                email: "",
                phone: "",
				password: ""
			}
		}
	},
	components: {
		Paginator
	},
	created() {
		this.getCustomers()
	},
	watch: {
		"$route.fullPath": function() {
			this.getCustomers()
		}
	},
	mounted() {

	},
	methods: {
		getCustomers() {
			this.isFetching = true
			let keySearch = this.$route.query.search
			let params = "?page="+this.pagination.page+"&size="+this.pagination.size
			if(keySearch){ params = params+"&query="+keySearch }
            CustomerService.getCustomers(params)
            .then((response) => {
				this.isFetching = false
                if (response.response && response.response.status == 200) {
                    this.data.customers = response.results
                    this.pagination.totalPage = response.totalPage
					this.pagination.length = response.length
					this.pagination.page = response.page
                }
            }).catch(err => { console.log(err) })
		},
		
		async searchCustomer(){
			this.pagination.page = 0
			const query = Object.assign({}, this.$route.query)
			query.search = this.keySearch
			await this.$router.push({ name: 'customer', query }).catch(() => {})
		},

		openDetailDialog(index){
			this.data.customer = this.data.customers[index]
			this.showDetailDialog = true
			this.getCustomerAddress(this.data.customer.id)
		},

		openCreateCustomerDialog(){
			this.showCreateCustomerDialog = true
		},

		openUpdateCustomerDialog(index) {
			this.updateCustomerIndex = index
			let customer = this.data.customers[index]
			this.customer = {
				id: customer.id,
				name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address
			}
			this.showUpdateCustomerDialog = true;
		},

		async validateBeforeCreateCustomer(){
            let validatedMessage = this.validateCustomerFields(this.customer);
            if (validatedMessage == "ok") {
                this.isCreatingCustomer = true
                this.createCustomer()
            } else {
				// this.$toasted.show(validatedMessage);
				alert(validatedMessage)
            }
		},

		validateCustomerFields(customer) {
            if (!customer.firstName) {
                return "First name cannot be empty!";
            } else if (!customer.lastName) {
                return "Last name cannot be empty!";
            } else if (!customer.phone) {
                return "Phone cannot be empty!";
            } else if (!customer.email) {
                return "Address cannot be empty!";
            } else if (!customer.password) {
                return "Password cannot be empty!";
            } else {
                return "ok";
            }
		},

		getCustomerAddress(customerId){
			CustomerService.getCustomerAddress(customerId).then((response) => {
				if (response && response.status == 200) {
					this.data.customerAddress = response.results
				}
			}).catch(err => { console.log(err) })
		},

		diableOrEnable(index){
			let enabled = this.data.customers[index].enabled
			if(enabled){
				this.enableCustomer(index)
			}else{
				this.disableCustomer(index)
			}
		},

		enableCustomer(index) {
			let customerId  = this.data.customers[index].id
			CustomerService.enableCustomer(customerId).then((response) => {
				this.isUpdating = false
				if (response && response.status == 200) {
					this.data.customers[index].enabled = true
					this.hideDialog()
				}
			}).catch(err => { console.log(err) })
		},

		disableCustomer(index) {
			let customerId  = this.data.customers[index].id
			CustomerService.disableCustomer(customerId).then((response) => {
				this.isUpdating = false
				if (response && response.status == 200) {
					this.data.customers[index].enabled = false
					this.hideDialog()
				}
			}).catch(err => { console.log(err) })
		},
		
		createCustomer(){
            let body = {
				"firstName": this.customer.firstName,
				"lastName": this.customer.lastName,
                "email": this.customer.email,
				"phone": this.customer.phone,
				"password": this.customer.password,
            }
            CustomerService.createCustomer(body) 
            .then((response) => {
                if(response.response && response.response.status == 200){
                    this.data.customers.push(response.results)
                    this.hideDialog()
                }
            }).catch(err => { console.log(err) })
		},

		updateCustomer(){
            let body = {
                "firstName": this.customer.firstName,
				"lastName": this.customer.lastName,
                "email": this.customer.email,
				"phone": this.customer.phone
            }
            CustomerService.updateCustomer(this.customer.id,body) 
            .then((response) => {
                if(response.response && response.response.status == 200){
					this.data.customers[this.updateCustomerIndex] = response.results
                    this.hideDialog()
                }
            }).catch(err => { console.log(err) })
		},

		validateBeforeReport(){
			let msgValidation = this.validateDate()
			if (msgValidation == "OK") {
				this.isGenerating = true
				let startDate = Helper.formatDate(this.report.startDate)
				let endDate = Helper.formatDate(this.report.endDate)
				let params = "?startDate="+startDate+"&endDate="+endDate
				CustomerService.getCustomerReport(params).then((response) => {
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

		hideDialog(){
			this.showCreateCustomerDialog = false
			this.showUpdateCustomerDialog = false

			this.isUpdating = false
			this.updateStatusIndex = -1
		},

		async changeLimit(){
			this.pagination.page = 0
			this.getCustomers()
		},

		formatDate(datetime){
			let date  = this.$moment().format(datetime | 'yyyy-mm-dd')
			return date.slice(0,10)
		},

		exportCSV() {
			this.$refs.dataCustomer.exportCSV();
		},

		onPage(event) {
			this.pagination.page = event.page
			this.getCustomers()
		},

		getFullPathImage(path){
			return process.env.VUE_APP_BASE_URL+path
		}
	}
}