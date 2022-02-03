
import CategoryService from './../../../utilities/services/CategoryService'
import BrandService from './../../../utilities/services/BrandService'
import CountryService from './../../../utilities/services/CountryService'
import UploadService from './../../../utilities/services/UploadService'
import Helper from './../../../utilities/Helper'
import ProductService from '../../../utilities/services/ProductService'

export default {
	name: "product-create",
	data() {
		return {
			isCreating: false,
			isUploadingImage: false,
			data: {
				categories: [],
				brands: [],
				countries: []
			},
			product: {
				imageFile: "",
				image: "",
				name: "",
				price: 0,
				discount: 0,
				photos: "",
				categoryId: "",
				countryId: "",
				brandId: "",
				status: true,
				description: "",
				shortDescription: ""
			},
			status: [
				{ name: "Enabled", value: true },
				{ name: "Disabled", value: false }
			]
		}
	},
	created() {
		this.getCategory()
		this.getBrand()
		this.getCountry()
	},
	mounted() {

	},
	methods: {
		getCategory() {
			let params = "?page=0&size=100"
			CategoryService.getCategories(params).then((response) => {
				this.isFetching = false
				if (response.response && response.response.status == 200) {
					this.data.categories = response.results
					this.product.categoryId = response.results[0].id
				}
			}).catch(err => { console.log(err) })
		},

		getBrand() {
			let params = "?page=0&size=100"
			BrandService.getBrand(params).then((response) => {
				this.isFetching = false
				if (response.response && response.response.status == 200) {
					this.data.brands = response.results
					this.product.brandId = response.results[0].id
				}
			}).catch(err => { console.log(err) })
		},

		getCountry() {
			let params = "?page=0&size=100"
			CountryService.getCountry(params).then((response) => {
				if (response.response && response.response.status == 200) {
					this.data.countries = response.results
					this.product.countryId = response.results[0].id
				}
			}).catch(err => { console.log(err) })
		},

		async validateBeforeCreate() {
			this.isCreating = true
			if (this.product.imageFile) {
				this.isUploadingImage = true
				this.uploadImage(this.product.imageFile)
			} else {
				this.createProduct()
			}
		},

		createProduct() {
			let msgValidation = this.validateBody()
			if (msgValidation == "OK") {
				this.isCreating = true
				let body = {
					"name": this.product.name,
					"price": this.product.price,
					"discount": this.product.discount,
					"thumbnail": this.product.image,
					"photos": this.product.image,
					"category": { "id": this.product.categoryId },
					"country": { "id": this.product.countryId },
					"brand": { "id": this.product.brandId },
					// "status": this.product.status,
					"description": this.product.description,
					"shortDescription": this.product.shortDescription
				}
				ProductService.createProduct(body).then((response) => {
					this.isCreating = false
					if (response.response && response.response.status == 200) {
						this.$router.push({name: 'product-update', params:{id: response.results.id}})
					}
				}).catch(err => { console.log(err) })
			} else {
				alert(msgValidation);
			}
		},

		async uploadImage(file) {
			let formData = new FormData()
			formData.append("file", file)
			await UploadService.uploadMedia("brand", formData)
				.then((response) => {
					if (response.response && response.response.status == 200) {
						this.isUploadingImage = false
						this.product.image = response.results.path
						this.createProduct()
					}
				})
		},

		validateBody() {
			if (!this.product.name) { return "Product name is required." }
			if (!this.product.price) { return "Price is required." }
			if (!this.product.discount.length == 0) { return "Discount is required." }
			if (!this.product.categoryId) { return "Category is required." }
			if (!this.product.countryId) { return "Country is required." }
			if (!this.product.brandId) { return "Brand is required." }
			return "OK"
		},

		chooseImage(e) {
			let images = e.target.files;
			if (images.length > 0) {
				this.product.image = ""
				for (let i = 0; i < images.length; i++) {
					var imageFile = images[i]
					Helper.compressImage(imageFile).then(file => {
						this.product.imageFile = file
					})
				}
			}
		},

		fileToPath(file) { return window.URL.createObjectURL(file) },

		getFullPathImage(path){
			return process.env.VUE_APP_BASE_URL+path
		}
	}
}