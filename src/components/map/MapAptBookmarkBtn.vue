<template>
  <b-button variant="outline-dark" @click="aptLike">
    <b-icon v-if="item.id != 0" icon="bookmarks-fill"></b-icon>
    <b-icon v-else icon="bookmarks"></b-icon>
  </b-button>
</template>

<script>
import { mapActions } from "vuex";
const mapStore = "mapStore";

export default {
  name: "MapAptBookmarkBtn",
  props: {
    item: Object,
  },
  methods: {
    ...mapActions(mapStore, ["likeApt", "dislikeApt"]),
    aptLike() {
      if (this.item.id == 0) {
        this.likeApt(this.item.aptCode);
      } else {
        this.dislikeApt(this.item.id);
      }
    },
  },
};
</script>

<style>
</style>