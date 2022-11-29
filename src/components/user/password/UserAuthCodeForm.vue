<template>
  <b-container>
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
        </b-card>
      </b-col>
      <b-col sm="3"></b-col> </b-row
  ></b-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
const userStore = "userStore";

export default {
  name: "UserAuthCodeForm",
  data() {
    return {
      authCode: null,
    };
  },
  computed: {
    ...mapState(userStore, ["userInfo"]),
  },
  methods: {
    ...mapActions(userStore, ["sendNewPwd"]),
    sendMail() {
      this.sendNewPwd({
        email: this.userInfo.userEmail,
        authCode: this.authCode,
      });
    },
  },
};
</script>

<style>
</style>