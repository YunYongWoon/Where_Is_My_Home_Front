<template>
  <b-card class="text-center">
    <map-apt-bookmark-btn v-if="isLogin" :item="item"></map-apt-bookmark-btn>
    <h3 class="m-1">{{ item.apartmentName }}</h3>
    <b-button variant="outline-primary" class="m-1" @click="setMarker">
      지도 보기
    </b-button>
    <b-button class="m-1" @click="showDetail"> 상세 보기 </b-button>
  </b-card>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import MapAptBookmarkBtn from "./MapAptBookmarkBtn";
const mapStore = "mapStore";
const userStore = "userStore";

export default {
  name: "MapAptItem",
  components: {
    MapAptBookmarkBtn,
  },
  props: {
    item: Object,
  },
  computed: {
    ...mapState(userStore, ["isLogin"]),
  },
  methods: {
    ...mapMutations(mapStore, ["SET_MARKER", "SET_DETAIL_HOUSE", "SET_MODAL"]),
    ...mapActions(mapStore, ["detailHouse"]),
    // ...mapActions(mapStore),

    setMarker() {
      this.SET_MARKER([this.item.lat, this.item.lng]);
    },
    showDetail() {
      this.detailHouse(this.item);
    },
  },
};
</script>

<style>
</style>