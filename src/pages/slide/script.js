import UploadService from './../../utilities/services/UploadService';
import SlideService from './../../utilities/services/SlideService';
import Helper from './../../utilities/Helper'

export default {
	name: "slide",
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
				slides: []
			},
			slide:{
				id: null,
				imageFile : "",
				image: "",
				url: "",
				title: "",
				description: "",
				status: "true",
				ordering: 0
			},
			pagination:{
				page : 0,
				size : 10,
				totalPage: 0,
				length: 0
			},
			slideStatus:[
				{value:"true", name:"Enabled"},
				{value:"false", name:"Disabled"}
			]
		}
	},
	created() {
		this.getSlide()
	},
	watch: {
		"$route.fullPath": function() {
			this.getSlide();
		},
	},
	mounted() {

	},
	methods: {
		getSlide() {
			let keySearch = this.$route.query.search
			let params = "?page="+this.pagination.page+"&size="+this.pagination.size
			if(keySearch){ params = params+"&query="+keySearch }
            SlideService.getSlide(params).then((response) => {
				this.isFetching = false
                if (response.response && response.response.status == 200) {
					this.data.slides = response.results
					this.pagination.totalPage = response.totalPage
					this.pagination.length = response.length
					this.pagination.page = response.page
                }
            }).catch(err => { console.log(err) })
		},

		async validateBeforeCreate(){
			this.isCreating = true
            if(this.slide.imageFile){
                this.isUploadingImage = true
                this.uploadImage(this.slide.imageFile)
            }else{
                this.createSlide()
            }
		},
		
		async validateBeforeUpdate(){
			this.isUpdating = true
            if(this.slide.imageFile){
                this.isUploadingImage = true
                this.uploadImage(this.slide.imageFile)
            }else{
                this.updateSlide()
            }
        },

		async uploadImage(file){
            let formData = new FormData()
            formData.append("file", file)
            await UploadService.uploadMedia("slide",formData)
            .then((response) => {
                if(response.response && response.response.status == 200){
                    this.isUploadingImage = false
					this.slide.image = response.results.path
					if(this.updateIndex > -1){
						this.updateSlide()
					}else{
						this.createSlide()
					}
                }
            })
        },

		createSlide(){
			let msgValidation = this.validateBody()
			if(msgValidation == "OK"){
				this.isCreating = true
				let body = {
					id: null,
					image: this.slide.image,
					status: this.slide.status,
					ordering: this.slide.ordering,
					actionUrl: this.slide.url,
					title: this.slide.title,
					description: this.slide.description
				}
				this.data.slides.push(body)
				SlideService.createSlide(this.data.slides).then((response) => {
					this.isCreating = false
					if (response.response && response.response.status == 200) {
						this.data.slides = response.results
						this.hideDialog()
					}
				}).catch(err => { console.log(err) })
			}else{
				this.$toasted.show(msgValidation);
			}
		},

		updateSlide() {
			let msgValidation = this.validateBody()
			if(msgValidation == "OK"){
				this.isUpdating = true
				this.data.slides[this.updateIndex] = {
					id: this.slide.id,
					image: this.slide.image,
					status: this.slide.status,
					ordering: this.slide.ordering,
					actionUrl: this.slide.url,
					title: this.slide.title,
					description: this.slide.description
				}
				SlideService.updateSlide(this.data.slides).then((response) => {
					this.isUpdating = false
					if (response.response && response.response.status == 200) {
						this.data.slides = response.results
						this.hideDialog()
					}
				}).catch(err => { console.log(err) })
			}else{
				this.$toasted.show(msgValidation);
			}
		},

		validateBody(){
			if(!this.slide.url){ return "Action URL is required." }
			return "OK"
		},

		openCreateDialog() {
			this.showCreateDialog = true;
		},

		openUpdateDialog(index) {
			this.updateIndex = index
			let slide = this.data.slides[index]
			this.slide = {
				id: slide.id,
				url: slide.actionUrl,
				image: slide.image,
				status: slide.status.toString(),
				ordering: slide.ordering,
				title: slide.title,
				description: slide.description
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
			this.slide = {
				imageFile : "",
				image: "",
				name: ""
			}
		},

		chooseImage(e){
            let images = e.target.files;
            if(images.length > 0){
                this.slide.image = ""
                for(let i=0; i<images.length; i++){
					var imageFile = images[i]
                    Helper.compressImage(imageFile).then(file => {
						this.$set(this.slide, 'imageFile', file);
                    })
                }
            }
		},
		
		fileToPath(file){ return window.URL.createObjectURL(file) },

		getFullPathImage(path){
			return process.env.VUE_APP_BASE_URL+path
		},

		onPage(event) {
			this.pagination.page = event.page
			this.getSlide()
		},
	}
}