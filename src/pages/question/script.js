import QuestionService from './../../utilities/services/QuestionService'
import Toast from 'primevue/toast';

export default {
	name: "question",
	data() {
		return {
			isFetching: true,
			isCreating: false,
			isUpdating: false,
			showCreateDialog: false,
			showUpdateDialog: false,
			updateIndex: -1,
			keySearch: "",
			data:{
				questions: []
			},
			question: "",
			country:{
				id: -1,
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
		this.getQuestion()
	},
	watch: {
		"$route.fullPath": function() {
			this.getQuestion();
		},
	},
	components:{
		Toast
	},
	mounted() {

	},
	methods: {
		toastMe(){
			this.$toast.add({severity:'success', summary: 'Success Message', detail:'Order submitted', life: 3000});
		},

		getQuestion() {
			let keySearch = this.$route.query.search
			let params = "?page="+this.pagination.page+"&size="+this.pagination.size
			if(keySearch){ params = params+"&query="+keySearch }
            QuestionService.getQuestion(params).then((response) => {
				this.isFetching = false
                if (response.response && response.response.status == 200) {
                    this.data.questions = response.results
                }
            }).catch(err => { console.log(err) })
		},

		closeQuestion(index) {
			let questionId = this.data.questions[index].id
            QuestionService.closeQuestion(questionId).then((response) => {
				this.isFetching = false
                if (response.response && response.response.status == 200) {
					this.data.questions[index].status = false
                }
            }).catch(err => { console.log(err) })
		},
		
		async searchQuestion(){
			this.pagination.page = 0
			const query = Object.assign({}, this.$route.query)
			query.search = this.keySearch
			await this.$router.push({ name: 'question', query }).catch(() => {})
		},
		
		async validateBeforeUpdate(){
			this.isUpdating = true
			this.isCreating = true
            this.updateCountry()
        },

		validateBody(){
			if(!this.country.name){ return "Country name is required." }
			return "OK"
		},

		openCreateDialog() {
			this.showCreateDialog = true;
		},

		openUpdateDialog(index) {
			this.question = this.data.questions[index]
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
			this.country = {
				name: ""
			}
		},

		getFullPathImage(path){
			return process.env.VUE_APP_BASE_URL+path
		}
	}
}