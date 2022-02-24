
import CategoryService from './../../../utilities/services/CategoryService'
import BrandService from './../../../utilities/services/BrandService'
import UploadService from './../../../utilities/services/UploadService'
import Helper from './../../../utilities/Helper'
import ProductService from '../../../utilities/services/ProductService'
import Variant from './components/variant'
import CountryService from '../../../utilities/services/CountryService'
import { VueEditor } from "vue2-editor";

export default {
	name: "product-update",
	data() {
		return {
			isUpdating: false,
			isCreatingVariant: false,
			isUploadingImage: false,
			uploadedPhotoLength: 0,
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
				photoFiles: [],
				photos: [],
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
		VueEditor,
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
							photoFiles: [],
							photos: product.photos.split(", "),
							categoryId: product.category.id,
							countryId: product.country ? product.country.id : '',
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

		removePhoto(index){
			this.product.photoFiles.splice(index,1)
		},

		removeOldPhoto(index){
			this.product.photos.splice(index,1)
		},

		async validateBeforeCreate() {
			this.isCreating = true
			if (this.product.imageFile && !this.product.image) {
				this.isUploadingImage = true
				this.uploadImage(this.product.imageFile)
			} else if (this.uploadedPhotoLength < this.product.photoFiles.length){
				this.isUploadingImage = true
				let file = this.product.photoFiles[this.uploadedPhotoLength]
				this.uploadPhoto(file)
			} else {
				this.createProduct()
			}
		},

		async validateBeforeUpdate() {
			this.isUpdating = true
			if (this.product.imageFile && !this.product.image) {
				this.isUploadingImage = true
				this.uploadImage(this.product.imageFile)
			} else if (this.uploadedPhotoLength < this.product.photoFiles.length){
				this.isUploadingImage = true
				let file = this.product.photoFiles[this.uploadedPhotoLength]
				this.uploadPhoto(file)
			} else {
				this.updateProduct()
			}
		},

		updateProduct() {
			let msgValidation = this.validateBody()
			if (msgValidation == "OK") {
				this.isUpdating = true
				let body = {
					"id": this.data.product.id,
					"name": this.product.name,
					"price": this.product.price,
					"thumbnail": this.product.image,
					"photos": this.product.photos.join(", "),
					"category": { "id": this.product.categoryId },
					"country": { "id": this.product.countryId },
					"brand": { "id": this.product.brandId },
					"description": this.product.description,
					"shortDescription": this.product.shortDescription
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
			await UploadService.uploadMedia("product", formData)
				.then((response) => {
					if (response.response && response.response.status == 200) {
						this.isUploadingImage = false
						this.product.image = response.results.path
						this.updateProduct()
					}
				})
		},

		async uploadPhoto(file) {
			let formData = new FormData()
			formData.append("file", file)
			await UploadService.uploadMedia("product", formData)
				.then((response) => {
					if (response.response && response.response.status == 200) {
						this.isUploadingImage = false
						this.product.photos.push(response.results.path)
						this.uploadedPhotoLength++
						this.validateBeforeUpdate()
					}
				})
		},

		async handleImageAdded(file, Editor, cursorLocation) {
			if (file) {
				let formData = new FormData();
				formData.append("file", file);
				await UploadService.uploadMedia("product",formData)
					.then((response) => {
						if (response.response && response.response.status == 200) {
							let url = process.env.VUE_APP_BASE_URL + response.results.path;
							Editor.insertEmbed(cursorLocation, "image", url);
						}
					})
			}
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

		choosePhoto(e) {
			let images = e.target.files;
			if (images.length > 0) {
				for (let i = 0; i < images.length; i++) {
					var imageFile = images[i]
					Helper.compressImage(imageFile).then(file => {
						this.product.photoFiles.push(file)
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