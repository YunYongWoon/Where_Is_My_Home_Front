<template>
  <b-container>
    <b-row class="m-5"></b-row>
    <b-row align-v="center" align-h="center">
      <main-text></main-text>
      <main-image></main-image>
    </b-row>
  </b-container>
</template>

<script>
import MainText from "@/components/main/MainText.vue";
import MainImage from "@/components/main/MainImage.vue";

export default {
  name: "MainView",
  components: {
    MainText,
    MainImage,
  },
  data() {
    return {};
  },
};
</script>

<style></style>
