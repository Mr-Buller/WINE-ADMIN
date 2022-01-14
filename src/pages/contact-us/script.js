import ContactService from './../../utilities/services/ContactService';

export default {
	name: "contact-us",
	data() {
		return {
			isFetching: true,
			isCreating: false,
			contact:{
				email: "",
				phone: "",
				telegram: "",
				facebook: "",
				instagram: "",
				youTube: ""
			},
		}
	},
	created() {
		this.getContact()
	},
	watch: {
		"$route.fullPath": function() {

		},
	},
	mounted() {

	},
	methods: {
		getContact() {
            ContactService.getContact().then((response) => {
				this.isFetching = false
                if (response.response && response.response.status == 200) {
					let contact = response.results
					this.contact = {
						email: contact.email,
						phone: contact.phone,
						telegram: contact.telegram,
						facebook: contact.facebook,
						instagram: contact.instagram,
						youTube: contact.youTube
					}
                }
            }).catch(err => { console.log(err) })
		},

		createContact(){
			this.isCreating = true
			let body = {
				"email": this.contact.email,
				"phone": this.contact.phone,
				"telegram": this.contact.telegram,
				"facebook": this.contact.facebook,
				"instagram": this.contact.instagram,
				"youTube": this.contact.youTube
			}
			ContactService.createContact(body).then((response) => {
				this.isCreating = false
				if (response.response && response.response.status == 200) {
					this.data.contact = response.results
				}
			}).catch(err => { console.log(err) })
		}
	}
}