
// import CategoryService from './../../../utilities/services/CategoryService'
// import BrandService from './../../../utilities/services/BrandService'
// import UploadService from './../../../utilities/services/UploadService'
// import Helper from './../../../utilities/Helper'
import ProductService from '../../../../../utilities/services/ProductService'
import VueTagsInput from '@johmun/vue-tags-input';

export default {
	name: "product-variant",
	data() {
		return {
			tags: '',
			options: [],
			isCreating: false,
			data: {
				variants: []
			},
			body: {
				chooseOption: "",
				options: [],
				optionMatrix: [],
				variants: []
			},
			update: {
				index: -1,
				variant: {
					price: 0,
					quantity: 0
				}
			},
		}
	},
	created() {
		this.getProductDetail()
	},
	components: {
		VueTagsInput
	},
	mounted() {

	},
	methods: {
		getProductDetail() {
			let productId = this.$route.params.id
			if (productId) {
				ProductService.getProductVariant(productId).then((response) => {
					this.isFetching = false
					if (response.response && response.response.status == 200) {
						this.data.variants = response.results
					}
				}).catch(err => { console.log(err) })
			} else {
				alert("Product ID is requried.")
			}
		},

		generateVariantion() {
			for (let o = 0; o < this.options.length; o++) {
				let itemOption = this.options[o]
				let objOption = {
					option: {
						name: itemOption.text
					},
					valueSelected: []
				}
				for (let v = 0; v < itemOption.values.length; v++) {
					let itemValue = itemOption.values[v]
					let objValue = {
						name: itemValue.text
					}
					objOption.valueSelected.push(objValue)
				}
				this.body.options.push(objOption)
			}

			let list = []
			for (let i = 0; i < this.body.options.length; i++) {
				let option = this.body.options[i]
				let selected = []
				for (let v = 0; v < option.valueSelected.length; v++) {
					let value = option.valueSelected[v]
					let objOption = {
						option: {
							name: option.name
						},
						optionValues: {
							name: value.name,
							option: {
								name: option.name
							}
						}
					}
					selected.push(objOption)
				}
				list.push(selected)
			}

			// Matrix option value
			var myResult = list[0].map(function (item) { return [item]; });
			for (var k = 1; k < list.length; k++) {
				var next = [];
				myResult.forEach(function (item) {
					list[k].forEach(function (word) {
						var line = item.slice(0);
						line.push(word);
						next.push(line);
					});
				});
				myResult = next;
			}
			this.body.optionMatrix = myResult

			// Orgazine variants
			let arrVariant = []
			for (let j = 0; j < myResult.length; j++) {
				let arrOption = myResult[j]
				let variant = {
					combination: this.getConbination(arrOption),
					imageUrl: "",
					price: 0,
					quantity: 0
				}
				arrVariant.push(variant)
			}
			this.body.variants = arrVariant
		},

		getConbination(arrOption) {
			let result = []
			for (let i = 0; i < arrOption.length; i++) {
				result.push(arrOption[i].optionValues.name)
			}
			return result.join('-').toLowerCase()
		},

		async confirmCreateVariants() {
			this.isCreating = true
			let productId = this.$route.params.id
			let options = []

			for (let o = 0; o < this.body.options.length; o++) {
				let itemOption = this.body.options[o]
				console.log("itemOption ", itemOption)
				let objOption = {
					option: itemOption.option.name,
					productOptionValue: []
				}
				for (let v = 0; v < itemOption.valueSelected.length; v++) {
					let itemValue = itemOption.valueSelected[v]
					let objValue = {
						optionValue: itemValue.name,
						optionValueImageUrl: ""
					}
					objOption.productOptionValue.push(objValue)
				}
				options.push(objOption)
			}

			for (let v = 0; v < this.body.variants.length; v++) {
				let variant = this.body.variants[v]
				variant.price = parseFloat(variant.price)
				variant.quantity = parseFloat(variant.quantity)
			}

			let body = {
				productOptions: options,
				productVariant: this.body.variants
			}

			ProductService.createProductVariant(productId, body).then((response) => {
				this.isCreating = false
				if (response.response && response.response.status == 200) {
					this.$router.push({ name: 'product' })
				}
			}).catch(err => { console.log(err) })
		},

		async updateVariant(index) {
			let variantId = this.data.variants[index].id
			let body = {
				"id": variantId,
				"price": this.update.price,
				"quantity": this.update.quantity
			}
			await ProductService.updateProductVariant(body)
				.then((res) => {
					if (res.response && res.response.status == 200) {
						this.data.variants[index] = res.results
						this.disableUpdateVariant()
					} else {
						alert(res.message)
					}
				})
		},

		enableUpdateVariant(index) {
			let variant = this.data.variants[index]
			this.update.index = index
			this.update.price = variant.price
			this.update.quantity = variant.quantity
		},

		disableUpdateVariant() {
			this.update = {
				index: -1,
				price: 0,
				quantity: 0
			}
		},

		formatNumber(x) {
			let result = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return result
		},
	}
}