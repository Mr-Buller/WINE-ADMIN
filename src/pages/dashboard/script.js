export default {
    name: "Dashboard",
    data() {
        return {
            tasksCheckbox: [],
            dropdownCities: [
				{name: 'New York', code: 'NY'},
				{name: 'Rome', code: 'RM'},
				{name: 'London', code: 'LDN'},
				{name: 'Istanbul', code: 'IST'},
				{name: 'Paris', code: 'PRS'}
            ],
            dropdownCity: null,
        }
    },
    components: {},
    created() {},
    methods: {}
};