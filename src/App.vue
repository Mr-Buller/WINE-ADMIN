<template>
    <div>
        <div v-if="routeName != 'login'" :class="containerClass" @click="onWrapperClick">
            <AppTopBar @menu-toggle="onMenuToggle" />

            <transition name="layout-sidebar">
                <div :class="sidebarClass" @click="onSidebarClick" v-show="isSidebarVisible()">
                    <div class="layout-logo">
                        <router-link to="/">
                            <img alt="Logo" :src="logo" />
                        </router-link>
                    </div>
                    <AppProfile />
                    <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
                </div>
            </transition>
            <div class="layout-main">
                <router-view />
            </div>
            <AppConfig hidden :layoutMode="layoutMode" :layoutColorMode="layoutColorMode" @layout-change="onLayoutChange" @layout-color-change="onLayoutColorChange"/>
            <AppFooter />
        </div>

        <router-view v-else />
    </div>
</template>

<script>
import AppTopBar from './AppTopbar.vue';
import AppProfile from './AppProfile.vue';
import AppMenu from './AppMenu.vue';
import AppConfig from './AppConfig.vue';
import AppFooter from './AppFooter.vue';

export default {
    data() {
        return {
            routeName: "",
            layoutMode: 'static',
            layoutColorMode: 'dark',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            menu : [
                {label: 'Dashboard', icon: 'pi pi-fw pi-chart-bar', to: '/', items: null},
                {label: 'Product', icon: 'pi pi-fw pi-inbox', to: '/product', items: null},
                {label: 'Discount', icon: 'pi pi-fw pi-dollar', to: '/discount', items: null},
                {label: 'Category', icon: 'pi pi-fw pi-sitemap', to: '/category', items: null},
                {label: 'Brand', icon: 'pi pi-fw pi-clone', to: '/brand', items: null},
                {label: 'Order', icon: 'pi pi-fw pi-shopping-cart', to: '/order', items: null},
                {label: 'Customer', icon: 'pi pi-fw pi-users', to: '/customer', items: null},
                {label: 'User', icon: 'pi pi-fw pi-user', to: '/user', items: null},
                {label: 'Role', icon: 'pi pi-fw pi-user-edit', to: '/role', items: null},
                {label: 'Slide', icon: 'pi pi-fw pi-image', to: '/slide', items: null},
                {label: 'Question', icon: 'pi pi-fw pi-question', to: '/question', items: null},
                {label: 'Country', icon: 'pi pi-fw pi-globe', to: '/country', items: null},
                {label: 'Contact Us', icon: 'pi pi-fw pi-exclamation-circle', to: '/contact-us', items: null},
				// {
				// 	label: 'User Management', icon: 'pi pi-fw pi-users', to: null,
				// 	items: [
				// 		{label: 'Employee', icon: 'pi pi-fw pi-user', to: '/user-management/employee'},
				// 		{label: 'Role', icon: 'pi pi-fw pi-sitemap', to: '/user-management/role'},
				// 		{label: 'Sale Commission', icon: 'pi pi-fw pi-id-card', to: '/user/sale-commission'}
				// 	]
				// },
            ]
        }
    },
    components: {
        'AppTopBar': AppTopBar,
        'AppProfile': AppProfile,
        'AppMenu': AppMenu,
        'AppConfig': AppConfig,
        'AppFooter': AppFooter,
    },
    created(){
        this.routeName = this.$route.name
    },
    watch: {
        $route() {
            this.menuActive = false;
            this.$toast.removeAllGroups();
        }
    },
    methods: {
        onWrapperClick() {
            if (!this.menuClick) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }

            this.menuClick = false;
        },
        onMenuToggle() {
            this.menuClick = true;

            if (this.isDesktop()) {
                if (this.layoutMode === 'overlay') {
					if(this.mobileMenuActive === true) {
						this.overlayMenuActive = true;
					}

                    this.overlayMenuActive = !this.overlayMenuActive;
					this.mobileMenuActive = false;
                }
                else if (this.layoutMode === 'static') {
                    this.staticMenuInactive = !this.staticMenuInactive;
                }
            }
            else {
                this.mobileMenuActive = !this.mobileMenuActive;
            }

            event.preventDefault();
        },
        onSidebarClick() {
            this.menuClick = true;
        },
        onMenuItemClick(event) {
            if (event.item && !event.item.items) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }
        },
		onLayoutChange(layoutMode) {
			this.layoutMode = layoutMode;
		},
		onLayoutColorChange(layoutColorMode) {
			this.layoutColorMode = layoutColorMode;
		},
        addClass(element, className) {
            if (element.classList)
                element.classList.add(className);
            else
                element.className += ' ' + className;
        },
        removeClass(element, className) {
            if (element.classList)
                element.classList.remove(className);
            else
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        },
        isDesktop() {
            return window.innerWidth > 1024;
        },
        isSidebarVisible() {
            if (this.isDesktop()) {
                if (this.layoutMode === 'static')
                    return !this.staticMenuInactive;
                else if (this.layoutMode === 'overlay')
                    return this.overlayMenuActive;
                else
                    return true;
            }
            else {
                return true;
            }
        },
    },
    computed: {
        containerClass() {
            return ['layout-wrapper', {
                'layout-overlay': this.layoutMode === 'overlay',
                'layout-static': this.layoutMode === 'static',
                'layout-static-sidebar-inactive': this.staticMenuInactive && this.layoutMode === 'static',
                'layout-overlay-sidebar-active': this.overlayMenuActive && this.layoutMode === 'overlay',
                'layout-mobile-sidebar-active': this.mobileMenuActive,
				'p-input-filled': this.$appState.inputStyle === 'filled',
				'p-ripple-disabled': this.$primevue.ripple === false
            }];
        },
        sidebarClass() {
            return ['layout-sidebar', {
                'layout-sidebar-dark': this.layoutColorMode === 'dark',
                'layout-sidebar-light': this.layoutColorMode === 'light'
            }];
        },
        logo() {
            return (this.layoutColorMode === 'dark') ? "assets/layout/images/logo-white.svg" : "assets/layout/images/logo.svg";
        }
    },
    beforeUpdate() {
        if (this.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    }
}
</script>

<style lang="scss">
@import './App.scss';
</style>
