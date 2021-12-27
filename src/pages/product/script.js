import UploadService from './../../utilities/services/UploadService';
import BrandService from './../../utilities/services/BrandService';
import ProductService from './../../utilities/services/ProductService';
import Helper from './../../utilities/Helper'

export default {
	name: "product",
	data() {
		return {
			isFetching: true,
			isUploadingImage: false,
			isCreating: false,
			isUpdating: false,
			showCreateDialog: false,
			showUpdateDialog: false,
			updateIndex: -1,
			keySearch: "",
			data:{
				categories: [],
				products: []
			},
			brand:{
				id: -1,
				imageFile : "",
				image: "",
				name: ""
			},
			pagination:{
				page : 0,
				size : 10,
				totalPage: 0,
				length: 0
			},
		}
	},
	created() {
		this.getProduct()
	},
	watch: {
		"$route.fullPath": function() {
			this.getProduct();
		},
	},
	mounted() {

	},
	methods: {
		getProduct() {
			this.keySearch = this.$route.query.query
			let params = "?page="+this.pagination.page+"&size="+this.pagination.size
			if(this.keySearch){ params = params+"&query="+this.keySearch }
            ProductService.getProduct(params).then((response) => {
				this.isFetching = false
                if (response.response && response.response.status == 200) {
                    this.data.products = response.results
                }
            }).catch(err => { console.log(err) })
		},
		
		async searchProduct(){
			this.pagination.page = 0
			const query = Object.assign({}, this.$route.query)
			query.query = this.keySearch
			await this.$router.push({ name: 'product', query }).catch(() => {})
		},

		async validateBeforeCreate(){
			this.isCreating = true
            if(this.brand.imageFile){
                this.isUploadingImage = true
                this.uploadImage(this.brand.imageFile)
            }else{
                this.createBrand()
            }
		},
		
		async validateBeforeUpdate(){
			this.isUpdating = true
			this.isCreating = true
            if(this.brand.imageFile){
                this.isUploadingImage = true
                this.uploadImage(this.brand.imageFile)
            }else{
                this.updateBrand()
            }
        },

		async uploadImage(file){
            let formData = new FormData()
            formData.append("file", file)
            await UploadService.uploadMedia("brand",formData)
            .then((response) => {
                if(response.response && response.response.status == 200){
                    this.isUploadingImage = false
					this.brand.image = response.results.path
					if(this.updateIndex > -1){
						this.updateBrand()
					}else{
						this.createBrand()
					}
                }
            })
        },

		createBrand(){
			let msgValidation = this.validateBody()
			if(msgValidation == "OK"){
				this.isCreating = true
				let body = {
					name: this.brand.name,
					logo: this.brand.image,
					status: true
				}
				BrandService.createBrand(body).then((response) => {
					this.isCreating = false
					if (response.response && response.response.status == 200) {
						this.data.categories.push(response.results)
						this.hideDialog()
					}
				}).catch(err => { console.log(err) })
			}else{
				this.$toasted.show(msgValidation);
			}
		},

		updateBrand() {
			let msgValidation = this.validateBody()
			if(msgValidation == "OK"){
				this.isUpdating = true
				let body = {
					id: this.brand.id,
					name: this.brand.name,
					logo: this.brand.image,
					status: true
				}
				BrandService.updateBrand(body).then((response) => {
					this.isUpdating = false
					if (response.response && response.response.status == 200) {
						this.data.categories[this.updateIndex] = response.results
						this.hideDialog()
					}
				}).catch(err => { console.log(err) })
			}else{
				this.$toasted.show(msgValidation);
			}
		},

		validateBody(){
			if(!this.brand.name){ return "Name is required." }
			return "OK"
		},

		openCreateDialog() {
			this.showCreateDialog = true;
		},

		openUpdateDialog(index) {
			this.updateIndex = index
			let brand = this.data.categories[index]
			this.brand = {
				id: brand.id,
				name: brand.name,
				image: brand.logo
			}
			this.showUpdateDialog = true
		},

		hideDialog() {
			this.showCreateDialog = false
			this.showUpdateDialog = false
			this.isUploadingImage = false
			this.isCreating = false
			this.isUpdating = false
			this.resetBody()
		},

		resetBody(){
			this.updateIndex = -1
			this.brand = {
				imageFile : "",
				image: "",
				name: ""
			}
		},

		chooseImage(e){
            let images = e.target.files;
            if(images.length > 0){
                this.brand.image = ""
                for(let i=0; i<images.length; i++){
					var imageFile = images[i]
                    Helper.compressImage(imageFile).then(file => {
						console.log(file)
                        this.brand.imageFile = file
                    })
                }
            }
		},
		
		fileToPath(file){ return window.URL.createObjectURL(file) },

		getFullPathImage(path){
			return process.env.VUE_APP_BASE_URL+path
		}
	}
}