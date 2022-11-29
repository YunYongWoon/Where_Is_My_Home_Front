<template>
  <b-navbar class="navbar" toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand href="#" to="/">Where Is My Home</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#" :to="{ name: 'map' }"> 아파트 조회 </b-nav-item>
        <b-nav-item v-if="isLogin" href="#" :to="{ name: 'board' }">
          자유 게시판
        </b-nav-item>
        <!-- <b-nav-item href="#" :to="{ name: 'noticeboard' }"> -->
        <!-- 공지사항 -->
        <!-- </b-nav-item> -->
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ms-auto">
        <template v-if="isLogin">
          <b-nav-item href="#" :to="{ name: 'mypage' }"
            >{{ userInfo.userNickname }}님
          </b-nav-item>
          <b-nav-item
            v-if="userInfo.type == 'ADMIN'"
            href="#"
            :to="{ name: 'ADMIN' }"
          >
            회원관리
          </b-nav-item>
          <!-- <b-nav-item v-else href="#" @click="moveMyPage">
            마이페이지
          </b-nav-item> -->
          <b-nav-item @click.prevent="logout"> 로그아웃 </b-nav-item>
        </template>
        <template v-else>
          <b-nav-item href="#" :to="{ name: 'join' }"> 회원 가입 </b-nav-item>
          <b-nav-item href="#" :to="{ name: 'login' }"> 로그인 </b-nav-item>
        </template>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <!-- <router-view></router-view> -->
</template>

<script>
import { mapActions, mapState } from "vuex";

const userStore = "userStore";

export default {
  name: "NavView",
  computed: {
    ...mapState(userStore, ["isLogin", "userInfo"]),
  },
  methods: {
    ...mapActions(userStore, ["userLogout"]),

    logout() {
      this.userLogout();
      if (this.$router.path !== "/") {
        this.$router.push({ name: "main" }).catch(() => {});
      }
    },
  },
};
</script>

<style scoped>
.navbar {
  height: 7%;
}
</style>
