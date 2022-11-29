<template>
  <b-container>
    <b-card>
      <b-card-body
        style="position: relative; height: 500px; overflow-y: scroll"
      >
        <map-apt-item v-for="(item, index) in houses" :key="index" :item="item">
        </map-apt-item>
      </b-card-body>
    </b-card>
    <map-apt-modal></map-apt-modal>
  </b-container>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import MapAptItem from "./MapAptItem.vue";
import MapAptModal from "./MapAptModal.vue";

const mapStore = "mapStore";

export default {
  data() {
    return {
      aptCode: null,
    };
  },
  created() {
    this.SET_MODAL(false);
  },
  computed: {
    ...mapState(mapStore, ["houses"]),
  },
  methods: {
    ...mapMutations(mapStore, ["SET_MODAL"]),
  },
  components: {
    MapAptItem,
    MapAptModal,
  },
};
</script>
<style scoped>
</style>
