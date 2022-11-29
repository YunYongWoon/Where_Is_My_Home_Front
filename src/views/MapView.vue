<template>
  <b-container class="bv-example-row mt-3 text-center">
    <h3 class="underline-steelblue md-3">
      <b-icon icon="person-lines-fill"></b-icon> Apartment Service
    </h3>
    <b-row class="">
      <map-dropdown></map-dropdown>
    </b-row>
    <b-row>
      <b-col cols="4">
        <map-apt-list></map-apt-list>
      </b-col>
      <b-col>
        <map-kakao></map-kakao>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import MapDropdown from "@/components/map/MapDropdown.vue";
import MapAptList from "@/components/map/MapAptList.vue";
import MapKakao from "@/components/map/MapKakao.vue";
export default {
  name: "MapView",
  components: { MapDropdown, MapAptList, MapKakao },
};
</script>

<style>
</style>