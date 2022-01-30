
import CategoryService from './../../../utilities/services/CategoryService'
import BrandService from './../../../utilities/services/BrandService'
import UploadService from './../../../utilities/services/UploadService'
import Helper from './../../../utilities/Helper'
import ProductService from '../../../utilities/services/ProductService'
import Variant from './components/variant'
import CountryService from '../../../utilities/services/CountryService'

export default {
	name: "product-update",
	data() {
		return {
			isUpdating: false,
			isCreatingVariant: false,
			isUploadingImage: false,
			data: {
				product: "",
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
			],
		}
	},
	created() {
		this.getProductDetail()
		this.getCategory()
		this.getBrand()
		this.getCountry()
	},
	components:{
		Variant
	},
	mounted() {

	},
	methods: {
		getProductDetail() {
			let productId = this.$route.params.id
			if(productId){
				ProductService.getProductDetail(productId).then((response) => {
					this.isFetching = false
					if (response.response && response.response.status == 200) {
						let product = response.results
						this.data.product = product
						this.product = {
							imageFile: "",
							image: product.thumbnail,
							name: product.name,
							price: product.price,
							discount: product.discount,
							photos: product.photos,
							categoryId: product.category.id,
							countryId: product.country.id,
							brandId: product.brand.id,
							status: product.status,
							description: product.description,
							shortDescription: product.shortDescription
						}
					}
				}).catch(err => { console.log(err) })
			}else{
				alert("Product ID is requried.")
			}
		},

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

		async validateBeforeUpdate() {
			this.isUpdating = true
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
				this.isUpdating = true
				let body = {
					"id": this.data.product.id,
					"name": this.product.name,
					"price": this.product.price,
					"discount": this.product.discount,
					"thumbnail": this.product.image,
					"photos": this.product.image,
					"category": { "id": this.product.categoryId },
					"country": { "id": this.product.countryId },
					"brand": { "id": this.product.brandId },
					"status": this.product.status
				}
				ProductService.updateProduct(body).then((response) => {
					this.isUpdating = false
					if (response.response && response.response.status == 200) {
						this.$router.push({name: "product"})
					}
				}).catch(err => { console.log(err) })
			} else {
				this.$toasted.show(msgValidation);
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
			if (!this.product.categoryId) { return "Category is required." }
			if (!this.product.brandId) { return "Brand is required." }
			if (!this.product.countryId) { return "Country is required." }
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