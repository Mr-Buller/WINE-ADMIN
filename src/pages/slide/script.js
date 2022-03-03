import UploadService from './../../utilities/services/UploadService';
import SlideService from './../../utilities/services/SlideService';
import Helper from './../../utilities/Helper'
import draggable from 'vuedraggable'

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
			data: {
				slides: []
			},
			slide: {
				id: null,
				imageFile: "",
				image: "",
				url: "",
				title: "",
				description: "",
				status: "true",
				ordering: 0
			},
			products:[],
			columns : [],
			pagination: {
				page: 0,
				size: 10,
				totalPage: 0,
				length: 0
			},
			slideStatus: [
				{ value: "true", name: "Enabled" },
				{ value: "false", name: "Disabled" }
			]
		}
	},
	created() {
		this.getSlide()
		this.products = [
			{"id": "1000","code": "f230fh0g3","name": "Bamboo Watch","description": "Product Description","image": "bamboo-watch.jpg","price": 65,"category": "Accessories","quantity": 24,"inventoryStatus": "INSTOCK","rating": 5},
			{"id": "1001","code": "nvklal433","name": "Black Watch","description": "Product Description","image": "black-watch.jpg","price": 72,"category": "Accessories","quantity": 61,"inventoryStatus": "INSTOCK","rating": 4},
			{"id": "1002","code": "zz21cz3c1","name": "Blue Band","description": "Product Description","image": "blue-band.jpg","price": 79,"category": "Fitness","quantity": 2,"inventoryStatus": "LOWSTOCK","rating": 3},
			{"id": "1003","code": "244wgerg2","name": "Blue T-Shirt","description": "Product Description","image": "blue-t-shirt.jpg","price": 29,"category": "Clothing","quantity": 25,"inventoryStatus": "INSTOCK","rating": 5},
			{"id": "1004","code": "h456wer53","name": "Bracelet","description": "Product Description","image": "bracelet.jpg","price": 15,"category": "Accessories","quantity": 73,"inventoryStatus": "INSTOCK","rating": 4},
			{"id": "1005","code": "av2231fwg","name": "Brown Purse","description": "Product Description","image": "brown-purse.jpg","price": 120,"category": "Accessories","quantity": 0,"inventoryStatus": "OUTOFSTOCK","rating": 4},
			{"id": "1006","code": "bib36pfvm","name": "Chakra Bracelet","description": "Product Description","image": "chakra-bracelet.jpg","price": 32,"category": "Accessories","quantity": 5,"inventoryStatus": "LOWSTOCK","rating": 3},
			{"id": "1007","code": "mbvjkgip5","name": "Galaxy Earrings","description": "Product Description","image": "galaxy-earrings.jpg","price": 34,"category": "Accessories","quantity": 23,"inventoryStatus": "INSTOCK","rating": 5},
			{"id": "1008","code": "vbb124btr","name": "Game Controller","description": "Product Description","image": "game-controller.jpg","price": 99,"category": "Electronics","quantity": 2,"inventoryStatus": "LOWSTOCK","rating": 4},
			{"id": "1009","code": "cm230f032","name": "Gaming Set","description": "Product Description","image": "gaming-set.jpg","price": 299,"category": "Electronics","quantity": 63,"inventoryStatus": "INSTOCK","rating": 3}
		]
		this.columns = [
			{field: 'code', header: 'Code'},
			{field: 'name', header: 'Name'},
			{field: 'category', header: 'Category'},
			{field: 'quantity', header: 'Quantity'}
		]
	},
	watch: {
		"$route.fullPath": function () {
			this.getSlide();
		},
	},
	components:{
		draggable
	},
	mounted() {

	},
	methods: {
		getSlide() {
			this.isFetching = true
			let keySearch = this.$route.query.search
			let params = ""
			if (keySearch) { params = params + "?query=" + keySearch }
			SlideService.getSlide(params).then((response) => {
				this.isFetching = false
				if (response.response && response.response.status == 200) {
					this.data.slides = response.results
				}
			}).catch(err => { console.log(err) })
		},

		updateSlideOrdering(){
			this.data.slides.map((item, index) => {
				item.ordering = index
			})
			SlideService.updateSlide(this.data.slides).then((response) => {
				this.isUpdating = false
				if (response.response && response.response.status == 200) {
					this.data.slides = response.results
					this.hideDialog()
				}
			}).catch(err => { console.log(err) })
		},
		onColReorder() {
			console.log("dfd ddd",)
			this.$toast.add({ severity: 'success', summary: 'Column Reordered', life: 3000 });
		},

		onRowReorder(event) {
			this.products = event.value;
			this.$toast.add({ severity: 'success', summary: 'Rows Reordered', life: 3000 });
		},

		async validateBeforeCreate() {
			this.isCreating = true
			if (this.slide.imageFile) {
				this.isUploadingImage = true
				this.uploadImage(this.slide.imageFile)
			} else {
				this.createSlide()
			}
		},

		async validateBeforeUpdate() {
			this.isUpdating = true
			if (this.slide.imageFile) {
				this.isUploadingImage = true
				this.uploadImage(this.slide.imageFile)
			} else {
				this.updateSlide()
			}
		},

		async uploadImage(file) {
			let formData = new FormData()
			formData.append("file", file)
			await UploadService.uploadMedia("slide", formData)
				.then((response) => {
					if (response.response && response.response.status == 200) {
						this.isUploadingImage = false
						this.slide.image = response.results.path
						if (this.updateIndex > -1) {
							this.updateSlide()
						} else {
							this.createSlide()
						}
					}
				})
		},

		createSlide() {
			let msgValidation = this.validateBody()
			if (msgValidation == "OK") {
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
			} else {
				this.$toasted.show(msgValidation);
			}
		},

		updateSlide() {
			let msgValidation = this.validateBody()
			if (msgValidation == "OK") {
				this.isUpdating = true
				this.data.slides[this.updateIndex] = {
					id: this.slide.id,
					image: this.slide.image,
					status: this.slide.status,
					ordering: this.updateIndex+1,
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
			} else {
				this.$toasted.show(msgValidation);
			}
		},

		validateBody() {
			if (!this.slide.url) { return "Action URL is required." }
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

		resetBody() {
			this.updateIndex = -1
			this.slide = {
				imageFile: "",
				image: "",
				name: ""
			}
		},

		chooseImage(e) {
			let images = e.target.files;
			if (images.length > 0) {
				this.slide.image = ""
				for (let i = 0; i < images.length; i++) {
					var imageFile = images[i]
					Helper.compressImage(imageFile).then(file => {
						this.$set(this.slide, 'imageFile', file);
					})
				}
			}
		},

		fileToPath(file) { return window.URL.createObjectURL(file) },

		getFullPathImage(path) {
			return process.env.VUE_APP_BASE_URL + path
		},

		onPage(event) {
			this.pagination.page = event.page
			this.getSlide()
		},
	}
}