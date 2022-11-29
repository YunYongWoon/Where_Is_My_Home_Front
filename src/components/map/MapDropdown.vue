<template>
  <b-container>
    <p>연월까지 조회하고 싶으시면 연월 필드도 입력해주세요.</p>
    <b-row class="mt-4 mb-4 text-center">
      <b-col class="sm-3">
        <b-form-select
          v-model="sidoName"
          :options="sidos"
          @change="gugunList"
        ></b-form-select>
      </b-col>
      <b-col class="sm-3">
        <b-form-select
          v-model="gugunName"
          :options="guguns"
          @change="dongList"
        ></b-form-select>
      </b-col>
      <b-col class="sm-3">
        <b-form-select
          v-model="dongCode"
          :options="dongs"
          @change="searchApt"
        ></b-form-select>
      </b-col>

      <b-col v-if="isLogin" class="sm-3" @click="getAllFavoriteApt">
        <b-button> 선호지역목록 </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

const mapStore = "mapStore";
const userStore = "userStore";

export default {
  name: "AptDropdown",
  data() {
    return {
      sidoName: null,
      gugunName: null,
      dongCode: null,
    };
  },
  computed: {
    ...mapState(mapStore, ["sidos", "guguns", "dongs"]),
    ...mapState(userStore, ["isLogin"]),
    // sidos() {
    //   return this.$store.state.sidos;
    // },
  },
  created() {
    // this.$store.dispatch("getSido");
    // this.sidoList();
    this.CLEAR_SIDO_LIST();
    this.CLEAR_GUGUN_LIST();
    this.CLEAR_DONG_LIST();
    this.CLEAR_APT_LIST();
    this.getSido();
  },
  methods: {
    ...mapActions(mapStore, [
      "getSido",
      "getGugun",
      "getDong",
      "getHouseList",
      "getFavoriteAptList",
    ]),
    ...mapMutations(mapStore, [
      "CLEAR_SIDO_LIST",
      "CLEAR_GUGUN_LIST",
      "CLEAR_DONG_LIST",
      "CLEAR_APT_LIST",
    ]),
    // sidoList() {
    //   this.getSido();
    // },
    gugunList() {
      // console.log(this.sidoCode);
      this.CLEAR_GUGUN_LIST();
      this.CLEAR_DONG_LIST();
      this.gugunName = null;
      this.dongCode = null;
      if (this.sidoName) this.getGugun(this.sidoName);
    },
    dongList() {
      this.CLEAR_DONG_LIST();
      this.dongName = null;
      if (this.sidoName && this.gugunName)
        this.getDong({ sidoName: this.sidoName, gugunName: this.gugunName });
    },
    searchApt() {
      if (this.dongCode) this.getHouseList(this.dongCode);
    },
    getAllFavoriteApt() {
      this.getFavoriteAptList();
    },
  },
};
</script>

<style>
</style>