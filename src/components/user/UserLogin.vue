<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert variant="secondary" show><h3>로그인</h3></b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="3"></b-col>
      <b-col>
        <b-card class="text-center mt-3" align="left">
          <b-form class="text-left">
            <b-alert show variant="danger" v-if="isLoginError"
              >아이디 또는 비밀번호를 확인하세요.</b-alert
            >
            <b-form-group label="아이디" label-for="userid">
              <b-form-input
                id="userid"
                :state="useridcheck"
                v-model="user.email"
                required
                placeholder="아이디 입력...."
                @keyup.enter="confirm"
              ></b-form-input>
              <b-form-invalid-feedback id="userid">
                아이디를 입력하세요
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="비밀번호" label-for="userpwd">
              <b-form-input
                type="password"
                id="userpwd"
                :state="userpwdcheck"
                v-model="user.password"
                required
                placeholder="비밀번호 입력...."
                @keyup.enter="confirm"
              ></b-form-input>
              <b-form-invalid-feedback id="userpwd">
                비밀번호를 입력하세요
              </b-form-invalid-feedback>
            </b-form-group>
            <b-button
              type="button"
              variant="primary"
              class="m-1"
              @click="confirm"
              >로그인</b-button
            >
            <b-button
              type="button"
              variant="success"
              class="m-1"
              @click="movePage"
              >회원가입</b-button
            >
            <b-button
              type="button"
              variant="danger"
              class="m-1"
              @click="moveFindPwd"
              >비밀번호 찾기</b-button
            >
          </b-form>
        </b-card>
      </b-col>
      <b-col sm="3"></b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

const userStore = "userStore";

export default {
  name: "UserLogin",
  data() {
    return {
      // isLoginError: false,
      user: {
        email: null,
        password: null,
      },
      useridcheck: null,
      userpwdcheck: null,
    };
  },
  created() {
    this.SET_IS_LOGIN_ERROR(false);
  },
  computed: {
    ...mapState(userStore, ["isLogin", "isLoginError", "userInfo"]),
  },
  methods: {
    ...mapActions(userStore, ["userConfirm", "getUserInfo"]),
    ...mapMutations(userStore, ["SET_IS_LOGIN_ERROR"]),

    async confirm() {
      this.userConfirm(this.user);
    },
    movePage() {
      this.$router.push({ name: "join" });
    },

    moveFindPwd() {
      this.$router.push({ name: "findPassword" });
    },
  },
};
</script>

<style></style>
