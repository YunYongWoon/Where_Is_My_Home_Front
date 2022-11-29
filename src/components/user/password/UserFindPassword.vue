<template>
  <b-container>
    <b-row>
      <b-col>
        <b-alert variant="secondary" show><h3>비밀번호 찾기</h3></b-alert>
      </b-col>
    </b-row>
    <b-row v-if="isPasswordCode">
      <user-auth-code-form></user-auth-code-form>
    </b-row>
    <b-row v-else>
      <user-email-form></user-email-form>
    </b-row>
  </b-container>
</template>

<script>
import UserEmailForm from "./UserEmailForm.vue";
import UserAuthCodeForm from "./UserAuthCodeForm.vue";
import { mapMutations, mapState } from "vuex";

const userStore = "userStore";

export default {
  name: "UserFindPassword",
  computed: {
    ...mapState(userStore, ["isPasswordCode"]),
  },
  created() {
    this.SET_IS_PASSWORD_CODE(false);
  },
  components: {
    UserEmailForm,
    UserAuthCodeForm,
  },
  methods: {
    ...mapMutations(userStore, ["SET_IS_PASSWORD_CODE"]),
  },
};
</script>

<style>
</style>