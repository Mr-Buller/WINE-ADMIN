<template>
  <div class="layout-profile">
    <div>
      <img :src="userInfo.photo ? getFullPathImage(userInfo.photo) : assets/layout/images/profile.png" alt style="border-radius:50%"/>
    </div>
    <button class="p-link layout-profile-link" @click="onClick">
      <span class="username">{{userInfo.firstName}} {{userInfo.lastName}}</span>
      <i class="pi pi-fw pi-angle-down"></i>
    </button>
    <transition name="layout-submenu-wrapper">
      <ul v-show="expanded">
        <li>
          <router-link :to="{name: 'account'}">
            <button class="p-link">
              <i class="pi pi-fw pi-user"></i>
              <span>Account</span>
            </button>
          </router-link>
        </li>
        <li>
          <router-link :to="{name: 'change-password'}">
            <button class="p-link">
              <i class="pi pi-fw pi-key"></i>
              <span>Change password</span>
            </button>
          </router-link>
        </li>
        <li hidden>
          <button class="p-link">
            <i class="pi pi-fw pi-inbox"></i>
            <span>Notifications</span>
            <span class="menuitem-badge">2</span>
          </button>
        </li>
        <li @click="showLogoutDialog = true">
          <button class="p-link">
            <i class="pi pi-fw pi-power-off"></i>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </transition>

    <!-- Dialog of Logout -->
    <Dialog
      :visible.sync="showLogoutDialog"
      :style="{width: '450px'}"
      header="Confirmation"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field" style="text-align:left">
        <label>Are you sure want to log out?</label>
      </div>
      <template #footer>
        <Button @click="logout" label="Log out" class="p-button-text" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import MainService from "./utilities/services/MainService";
export default {
  data() {
    return {
      expanded: false,
      showLogoutDialog: false,
      userInfo: ""
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      let userInfo = this.$cookies.get("userInfo");
      this.userInfo = userInfo;
      if (userInfo) {
        this.userInfo = userInfo;
      }
    },
    getFullPathImage(path) {
      return process.env.VUE_APP_BASE_URL + path;
    },
    onClick(event) {
      this.expanded = !this.expanded;
      event.preventDefault();
    },
    logout() {
      MainService.logout();
    }
  }
};
</script>

<style scoped>
</style>