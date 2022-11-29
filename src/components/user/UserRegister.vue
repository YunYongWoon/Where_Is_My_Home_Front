<template>
  <b-container fluid class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert variant="secondary" show><h3>회원가입</h3></b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="3"></b-col>
      <b-col>
        <b-card align="left">
          아이디
          <b-input-group class="mb-3">
            <b-form-input
              required
              v-model="id"
              :state="isVaildEmail"
              placeholder="Enter your id"
            ></b-form-input>
            <p>@</p>
            <b-form-input
              required
              v-model="domain"
              :state="isVaildEmail"
              placeholder="Enter your domain"
            ></b-form-input>
            <b-input-group-append>
              <b-button variant="primary" @click="checkId">중복체크</b-button>
            </b-input-group-append>
            <b-form-invalid-feedback id="isVaildEmail">
              다른 아이디를 사용하세요.
            </b-form-invalid-feedback>
          </b-input-group>

          비밀번호
          <b-input-group class="mb-3">
            <b-form-input
              required
              type="password"
              v-model="user.password"
              placeholder="Enter your password"
            ></b-form-input>
          </b-input-group>

          비밀번호 재확인
          <b-input-group class="mb-3">
            <b-form-input
              required
              type="password"
              v-model="checkpwd"
              id="checkpwd"
              :state="checkPwdState"
              placeholder="Enter your password again"
            ></b-form-input>
            <b-form-invalid-feedback id="checkpwd">
              비밀번호가 일치하지 않습니다.
            </b-form-invalid-feedback>
          </b-input-group>

          닉네임
          <b-input-group class="mb-3">
            <b-form-input
              required
              v-model="user.nickname"
              placeholder="Enter your nickname"
            ></b-form-input>
          </b-input-group>

          <b-button
            type="button"
            variant="success"
            class="m-1"
            @click="registerUser"
            >회원가입</b-button
          >
        </b-card>
      </b-col>
      <b-col sm="3"></b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

const userStore = "userStore";

export default {
  name: "UserRegister",
  data() {
    return {
      // isLoginError: false,
      user: {
        email: null,
        password: null,
        nickname: null,
      },
      id: null,
      domain: null,
      checkid: true,
      checkpwd: null,
    };
  },
  created() {
    this.user.email = "";
    this.user.password = null;
    this.user.nickname = null;
    this.id = null;
    this.domain = null;
    this.checkid = true;
    this.checkpwd = null;
    this.SET_VALID_EMAIL(true);
  },
  computed: {
    ...mapState(userStore, ["isVaildEmail", "isAuth"]),
    checkPwdState() {
      return this.user.password == this.checkpwd;
    },
  },
  methods: {
    ...mapActions(userStore, ["checkEmail", "userRegister"]),
    ...mapMutations(userStore, ["SET_VALID_EMAIL"]),
    checkId() {
      // 아이디 중복체크
      this.user.email = this.id + "@" + this.domain;
      this.checkEmail({ email: this.user.email });
    },
    registerUser() {
      // 회원가입 로직
      if (this.isVaildEmail && this.user.password == this.checkpwd) {
        this.user.email = this.id + "@" + this.domain;
        this.userRegister(this.user);
      } else {
        alert("아이디나 비밀번호를 다시 체크해주세요");
      }
    },
  },
};
</script>

<style></style>
