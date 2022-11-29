<template>
  <div>
    <b-modal
      v-model="modal"
      size="lg"
      scrollable
      hide-header-close
      hide-footer
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      title="아파트 거래 상세정보"
      ref="apt-modal"
    >
      <b-card class="mb-3">
        <b-table-simple hover responsive>
          <b-thead head-variant="dark">
            <b-tr>
              <b-th>날짜</b-th>
              <b-th>거래금액</b-th>
              <b-th>층</b-th>
              <b-th>크기</b-th>
            </b-tr>
          </b-thead>
          <tbody>
            <!-- 하위 component인 BoardListItem에 데이터 전달(props) -->
            <map-deal-item v-for="deal in deals" :key="deal.no" v-bind="deal" />
          </tbody>
        </b-table-simple>
        <b-button v-if="hasNextData" @click="moreData"> more data </b-button>
      </b-card>
      <b-button @click="closeModal"> close </b-button>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import MapDealItem from "./MapDealItem.vue";

const mapStore = "mapStore";

export default {
  name: "MapAptModal",
  computed: {
    ...mapState(mapStore, [
      "house",
      "modal",
      "deals",
      "nextCur",
      "hasNextData",
    ]),
  },
  components: {
    MapDealItem,
  },
  methods: {
    ...mapMutations(mapStore, ["SET_MODAL"]),
    ...mapActions(mapStore, ["getMoreData"]),

    closeModal() {
      this.SET_MODAL(false);
    },
    moreData() {
      this.getMoreData({ aptCode: this.house.aptCode, cur: this.nextCur });
    },
  },
};
</script>

<style>
</style>