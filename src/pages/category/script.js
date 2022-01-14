import UploadService from './../../utilities/services/UploadService';
import CategoryService from './../../utilities/services/CategoryService';
import Helper from './../../utilities/Helper'

export default {
	name: "category",
	data() {
		return {
			isFetching: true,
			isCreatingCategory: false,
			isUpdatingCategory: false,
			isUploadingImage: false,
			showCreateCategoryDialog: false,
			showUpdateCategoryDialog: false,
			updateIndex: -1,
			keySearch: "",
			data:{
				categories: []
			},
			category:{
				id: -1,
				name: "",
				imageFile : "",
				image: "",
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
		this.getCategory()
	},
	watch: {
		"$route.fullPath": function() {
			this.getCategory();
		},
	},
	mounted() {

	},
	methods: {
		getCategory() {
			let keySearch = this.$route.query.search
			let params = "?page="+this.pagination.page+"&size="+this.pagination.size
			if(keySearch){ params = params+"&query="+keySearch }
            CategoryService.getCategories(params).then((response) => {
				this.isFetching = false
                if (response.response && response.response.status == 200) {
                    this.data.categories = response.results
                }
            }).catch(err => { console.log(err) })
		},
		
		async searchCategory(){
			this.pagination.page = 0
			const query = Object.assign({}, this.$route.query)
			query.search = this.keySearch
			await this.$router.push({ name: 'category', query }).catch(() => {})
		},
		
		async validateBeforeCreate(){
			this.isCreatingCategory = true
            if(this.category.imageFile){
                this.isUploadingImage = true
                this.uploadImage(this.category.imageFile)
            }else{
                this.createCategory()
            }
		},
		
		async validateBeforeUpdate(){
			this.isUpdatingCategory = true
			this.isCreatingCategory = true
            if(this.category.imageFile){
                this.isUploadingImage = true
                this.uploadImage(this.category.imageFile)
            }else{
                this.updateCategory()
            }
        },

		async uploadImage(file){
            let formData = new FormData()
            formData.append("file", file)
            await UploadService.uploadMedia("category",formData)
            .then((response) => {
                if(response.response && response.response.status == 200){
                    this.isUploadingImage = false
					this.category.image = response.results.path
					if(this.updateIndex > -1){
						this.updateCategory()
					}else{
						this.createCategory()
					}
                }
            })
        },

		createCategory(){
			let msgValidation = this.validateBodyCategory()
			if(msgValidation == "OK"){
				this.isCreatingCategory = true
				let body = {
					name: this.category.name,
					status: true,
					image: this.category.image,
				}
				CategoryService.createCategory(body).then((response) => {
					this.isCreatingCategory = false
					if (response.response && response.response.status == 200) {
						this.data.categories.push(response.results)
						this.hideDialog()
					}
				}).catch(err => { console.log(err) })
			}else{
				this.$toasted.show(msgValidation);
			}
		},

		updateCategory() {
			let msgValidation = this.validateBodyCategory()
			if(msgValidation == "OK"){
				this.isUpdatingCategory = true
				let body = {
					id: this.category.id,
					name: this.category.name,
					status: true,
					image: this.category.image,
				}
				CategoryService.updateCategory(body).then((response) => {
					this.isUpdatingCategory = false
					if (response.response && response.response.status == 200) {
						this.data.categories[this.updateIndex] = response.results
						this.hideDialog()
					}
				}).catch(err => { console.log(err) })
			}else{
				this.$toasted.show(msgValidation);
			}
		},

		validateBodyCategory(){
			if(!this.category.name){ return "Name is required." }
			return "OK"
		},

		openCreateCategoryDialog() {
			this.showCreateCategoryDialog = true;
		},

		openUpdateDialog(index) {
			this.updateIndex = index
			let category = this.data.categories[index]
			this.category = {
				id: category.id,
				name: category.name,
				status: category.status,
				image: category.image
			}
			this.showUpdateCategoryDialog = true
		},

		hideDialog() {
			this.showCreateCategoryDialog = false
			this.showUpdateCategoryDialog = false
			this.isCreatingCategory = false
			this.isUpdatingCategory = false
			this.resetBodyCategory()
		},

		resetBodyCategory(){
			this.updateIndex = -1
			this.category = {
				name: "",
				imageFile : "",
				image: "",
			}
		},

		chooseImage(e){
            let images = e.target.files;
            if(images.length > 0){
                this.category.image = ""
                for(let i=0; i<images.length; i++){
					var imageFile = images[i]
                    Helper.compressImage(imageFile).then(file => {
						console.log(file)
						this.$set(this.category, 'imageFile', file);
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