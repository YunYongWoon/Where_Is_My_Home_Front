<template>
  <b-container>
    <div id="map"></div>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
const mapStore = "mapStore";

export default {
  name: "MapKakao",
  data() {
    return {
      map: null,
      aptName: null,
      markers: null,
    };
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=11899fd9567d1d9dac9d99b6dcd13dec";
      document.head.appendChild(script);
    }
  },
  methods: {
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 5,
      };

      //지도 객체를 등록합니다.
      //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
      this.map = new kakao.maps.Map(container, options);
    },
    displayMarker(position) {
      if (this.markers) {
        this.markers.setMap(null);
      }
      const pos = new kakao.maps.LatLng(...position);
      this.markers = new kakao.maps.Marker({
        map: this.map,
        position: pos,
      });
      this.map.panTo(pos);
      this.markers.setMap(this.map);
    },
  },
  computed: {
    ...mapState(mapStore, ["marker"]),
  },
  watch: {
    marker: function (marker) {
      this.displayMarker(marker);
    },
  },
};
</script>

<style>
#map {
  width: 100;
  height: 530px;
}
</style>