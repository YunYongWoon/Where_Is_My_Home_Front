<template>
  <b-container>
    <b-row>
      <b-col>
        <b-alert variant="secondary" show><h3>비밀번호 수정</h3></b-alert>
      </b-col>
    </b-row>
    기존 비밀번호
    <b-input-group class="mb-3">
      <b-form-input
        required
        type="password"
        v-model="passwords.password"
        placeholder="Enter your password"
      ></b-form-input>
    </b-input-group>

    새 비밀번호
    <b-input-group class="mb-3">
      <b-form-input
        required
        type="password"
        v-model="passwords.newPassword"
        placeholder="Enter your new password"
      ></b-form-input>
    </b-input-group>

    새 비밀번호 재확인
    <b-input-group class="mb-3">
      <b-form-input
        required
        type="password"
        v-model="checkNewPassword"
        id="checkpwd"
        :state="checkPwdState"
        placeholder="Enter your new password again"
      ></b-form-input>
      <b-form-invalid-feedback id="checkpwd">
        비밀번호가 일치하지 않습니다.
      </b-form-invalid-feedback>
    </b-input-group>
    <b-row>
      <b-button
        type="button"
        variant="danger"
        class="m-1"
        @click="changePassword"
        >비밀번호 변경</b-button
      >
      <b-button type="button" variant="primary" class="m-1" @click="back"
        >돌아가기</b-button
      >
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
const userStore = "userStore";

export default {
  name: "UserChangePassword",
  data() {
    return {
      passwords: {
        password: null,
        newPassword: null,
      },
      checkNewPassword: null,
    };
  },
  created() {
    if (!this.isLogin) {
      alert("권한이 없습니다.");
      this.$router.push({ name: "main" });
    }
  },
  computed: {
    ...mapState(userStore, ["isLogin"]),
    checkPwdState() {
      return this.passwords.newPassword === this.checkNewPassword;
    },
  },
  methods: {
    ...mapActions(userStore, ["changePwd"]),
    back() {
      this.$router.push({ name: "mypage" });
    },
    changePassword() {
      if (this.passwords.newPassword === this.checkNewPassword) {
        this.changePwd(this.passwords);
      } else {
        alert("새로운 비밀번호가 일치하지 않습니다.");
      }
    },
  },
};
</script>

<style>
</style>