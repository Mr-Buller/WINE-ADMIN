import UploadService from './../../../utilities/services/UploadService'
import Helper from './../../../utilities/Helper'
import ProductService from '../../../utilities/services/ProductService'
import DiscountService from '../../../utilities/services/DiscountService'

export default {
	name: "discount-update",
	data() {
		return {
			isCreating: false,
			isUploadingImage : false,
			searchProductKey : "",
			currentDate: this.formatDate(Date),
			data: {
				discount: "",
				products: [],
			},
			discount: {
				imageFile: "",
				image: "",
				title: "",
				subTitle: "",
				description: "",
				startDate: "",
				endDate: "",
				dateRange: []
			},
			productSelected: []
		}
	},
	created() {
		this.getDiscountDetail()
		this.getProduct()
	},
	mounted() {

	},
	methods: {
		getDiscountDetail() {
			let discountId = this.$route.params.id
			if(discountId){
				DiscountService.getDiscountDetail(discountId).then((response) => {
					this.isFetching = false
					if (response.response && response.response.status == 200) {
						let discount = response.results
						this.data.discount = discount
						let startDate = new Date(discount.startDate).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
						let endDate = new Date(discount.endDate).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })

						this.discount = {
							imageFile: "",
							image: discount.thumbnail,
							title: discount.title,
							subTitle: discount.subTitle,
							description: discount.description,
							startDate: startDate,
							endDate: endDate
						}
						this.productSelected = discount.discountDetail
					}
				}).catch(err => { console.log(err) })
			}else{
				alert("Discount ID is requried.")
			}
		},

		searchProduct(){
			this.getProduct(this.searchProductKey)
		},

		getProduct(searchProductKey) {
			let params = "?page=0&size=10"
			if(searchProductKey){ params = params+"&query="+searchProductKey }
            ProductService.getProduct(params).then((response) => {
				this.isFetching = false
                if (response.response && response.response.status == 200) {
					this.data.products = response.results
                }
            }).catch(err => { console.log(err) })
		},

		chooseProduct(productIndex){
			let product = this.data.products[productIndex]
			let index = this.productSelected.findIndex((el) => 
				el.id == product.id 
			)
			if(index > -1){
				this.productSelected.splice(index,1)
			}else{
				let newObj = {
					product : product,
					percentage: 0
				}
				this.productSelected.push(newObj)
			}
		},

		checkProductIsSelected(productId){
			let index = this.productSelected.findIndex((el) => 
				el.product.id == productId
			)
			return index > -1 ? true : false
		},

		removeProductSelected(productIndex){
			this.productSelected.splice(productIndex,1)
		},

		async validateBeforeCreate() {
			this.isCreating = true
			if (this.discount.imageFile) {
				this.isUploadingImage = true
				this.uploadImage(this.discount.imageFile)
			} else {
				this.createDiscount()
			}
		},

		createDiscount() {
			let msgValidation = this.validateBody()
			if (msgValidation == "OK") {
				this.isCreating = true
				let body = {
					"id": this.$route.params.id,
					"title": this.discount.title,
					"thumbnail": this.discount.image,
					"subTitle": this.discount.subTitle,
					"startDate": this.discount.startDate,
					"endDate": this.discount.endDate,
					"description": this.discount.description,
					"discountDetail": this.productSelected
				}
				DiscountService.updateDiscount(body).then((response) => {
					this.isCreating = false
					if (response.response && response.response.status == 200) {
						this.$router.push({name: 'discount'})
					}
				}).catch(err => { console.log(err) })
			} else {
				this.isCreating = false
				alert(msgValidation);
			}
		},

		async uploadImage(file) {
			let formData = new FormData()
			formData.append("file", file)
			await UploadService.uploadMedia("discount", formData)
				.then((response) => {
					if (response.response && response.response.status == 200) {
						this.isUploadingImage = false
						this.discount.image = response.results.path
						this.createDiscount()
					}
				})
		},

		validateBody() {
			if (!this.discount.title) { return "Title is required." }
			if (!this.discount.startDate) { return "Start date is required." }
			if (!this.discount.endDate) { return "End date is required." }
			let endDate = Date.parse(this.discount.endDate);
			let startDate = Date.parse(this.discount.startDate);
			if (endDate < startDate) {
				return "End date must be bigger than start date."
			}
			if (this.productSelected.length == 0) { return "Selecting product is required." }
			return "OK"
		},

		chooseImage(e) {
			let images = e.target.files;
			if (images.length > 0) {
				this.discount.image = ""
				for (let i = 0; i < images.length; i++) {
					var imageFile = images[i]
					Helper.compressImage(imageFile).then(file => {
						this.discount.imageFile = file
					})
				}
			}
		},

		fileToPath(file) { return window.URL.createObjectURL(file) },

		getFullPathImage(path){
			return process.env.VUE_APP_BASE_URL+path
		},

		formatDate(datetime){
			let date  = this.$moment().format(datetime | 'yyyy-mm-dd')
			return date.slice(0,10)
		},

		formatPrice(price){
            return Helper.formatPrice(price)
        },
	}
}