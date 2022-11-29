<template>
  <b-container>
    <b-row>
      <b-col>
        <b-alert variant="secondary" show><h3>메일 인증</h3></b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="3"></b-col>
      <b-col>
        <b-card
          >인증번호
          <b-input-group class="mb-3">
            <b-form-input
              required
              v-model="authCode"
              placeholder="Enter your code"
            ></b-form-input>
          </b-input-group>
          <b-button
            type="button"
            variant="primary"
            class="m-1"
            @click="sendMail"
            >메일 전송</b-button
          >
          <b-button
            type="button"
            variant="success"
            class="m-1"
            @click="authMail"
            >메일 인증</b-button
          >
        </b-card>
      </b-col>
      <b-col sm="3"></b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

const userStore = "userStore";

export default {
  name: "UserMailAuth",
  data() {
    return {
      authCode: null,
    };
  },
  created() {
    console.log(this.isAuth);
    if (this.isAuth) {
      this.$router.push({ name: "main" });
    }
  },
  computed: {
    ...mapState(userStore, ["isAuth", "userInfo", "isEmailSend"]),
  },
  methods: {
    ...mapActions(userStore, ["registerMail", "registerCode"]),
    async sendMail() {
      this.registerMail(this.userInfo.userEmail);
    },
    async authMail() {
      if (this.isEmailSend) {
        this.registerCode({
          email: this.userInfo.userEmail,
          authCode: this.authCode,
        });
      } else {
        alert("이메일 전송을 먼저 진행해주세요.");
      }
    },
  },
};
</script>

<style>
</style>