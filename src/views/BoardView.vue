<template>
  <b-container class="bv-example-row mt-3 text-center">
    <h3 class="underline-hotpink"><b-icon icon="journals"></b-icon> 게시판</h3>
    <router-view></router-view>
  </b-container>
</template>
<script>
import { mapMutations, mapState } from "vuex";
const mapStore = "mapStore";
const userStore = "userStore";

export default {
  name: "BoardView",
  created() {
    this.SET_MODAL(false);
    if (!this.isLogin) {
      alert("권한이 없습니다.");
      this.$router.push({ name: "main" });
    }
  },
  computed: {
    ...mapState(userStore, ["isLogin"]),
  },
  methods: {
    ...mapMutations(mapStore, ["SET_MODAL"]),
  },
};
</script>
<style scoped>
.underline-hotpink {
  display: inline-block;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 70%,
    rgba(231, 27, 139, 0.3) 30%
  );
}
</style>
