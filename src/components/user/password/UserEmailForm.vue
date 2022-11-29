<template>
  <b-container>
    <b-row>
      <b-col sm="3"></b-col>
      <b-col>
        <b-card
          >이메일
          <b-input-group class="mb-3">
            <b-form-input
              required
              v-model="user.email"
              placeholder="Enter your email"
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
import { mapActions } from "vuex";

const userStore = "userStore";

export default {
  name: "UserEmailForm",
  data() {
    return {
      user: {
        email: null,
      },
    };
  },
  methods: {
    ...mapActions(userStore, ["sendPwdCode"]),
    sendMail() {
      this.sendPwdCode(this.user);
    },
  },
};
</script>

<style>
</style>