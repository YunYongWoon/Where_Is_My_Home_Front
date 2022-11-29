<template>
  <b-col lg="6">
    <b-img :src="logoImg" fluid alt="Responsive image"></b-img>
  </b-col>
</template>

<script>
import LogoImg from "@/assets/WelcomeImg.png";
export default {
  data() {
    return {
      logoImg: LogoImg,
    };
  },
};
</script>

<style></style>
