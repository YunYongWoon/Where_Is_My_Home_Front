<template>
  <b-tr>
    <b-td>{{ dealYear }} / {{ dealMonth }} / {{ dealDay }}</b-td>
    <b-td>{{ dealAmount }}만원</b-td>
    <b-td>{{ floor }}</b-td>
    <b-td>{{ area }}</b-td>
  </b-tr>
</template>

<script>
export default {
  name: "MapDealItem",
  props: {
    no: Number,
    dealAmount: String,
    dealDay: Number,
    dealMonth: Number,
    dealYear: Number,
    floor: String,
    area: String,
  },
};
</script>

<style>
</style>