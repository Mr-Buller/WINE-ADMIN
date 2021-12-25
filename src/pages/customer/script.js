import CustomerService from './../../utilities/services/CustomerService';
import Paginator from 'primevue/paginator';

export default {
	name: "contact-management-customer",
	data() {
		return {
			isFetching: true,
			showCreateCustomerDialog: false,
			showUpdateCustomerDialog: false,
			isCreatingCustomer: false,
			isUpdatingCustomer: false,
			updateCustomerIndex: -1,
			keySearch: "",
			data:{
				customers: [],
				roles: []
			},
			pagination:{
				page : 0,
				size : 10,
				totalPage: 0,
				length: 0
			},
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

		hideDialog(){
			this.showCreateCustomerDialog = false
			this.showUpdateCustomerDialog = false
		},

		exportCSV() {
			this.$refs.dataCustomer.exportCSV();
		},

		onPage(event) {
			this.pagination.page = event.page
			this.getCustomers()
		},
	}
}