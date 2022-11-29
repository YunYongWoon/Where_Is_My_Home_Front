<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert show><h3>글목록</h3></b-alert>
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col class="text-right">
        <b-button variant="outline-primary" @click="moveWrite()">글쓰기</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <table class="table table-layout: fixed">
          <thead>
            <tr>
              <td>글 번호</td>
              <td>작성자</td>
              <td>제목</td>
              <td>조회수</td>
              <td>수정일</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(article, index) in articles" :key="index">
              <td>{{ article.id }}</td>
              <td>{{ article.nickname }}</td>
              <td>
                <router-link
                  :to="{
                    name: 'boardview',
                    params: { id: article.id},
                  }"
                >
                  {{ article.title }}
                </router-link>
              </td>
              <td>{{ article.hit }}</td>
              <td>{{ article.updatedAt }}</td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>

    <!-- 페이징 UI -->
    <b-row class="col-md-3" style="float: none; margin: 0 auto">
      <div class="overflow-auto">
        <b-pagination
          v-model="currentPage"
          :per-page="perPage"
          :total-rows="rows"
          aria-controls="my-table"
        ></b-pagination>

        <p class="mt-3">Current Page: {{ currentPage }}</p>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import { listArticle, getArticleTotalLength } from "@/apis/board";

export default {
  name: "BoardList",
  data() {
    return {
      visPage: [1],
      currentPage: 1,
      perPage: 5,
      rows: 0, // 서버에서 받아온값 들어간다
      articles: [],
    };
  },
  created() {
    let param = {
      pg: 1, // 페이지 네비 누르면 이거 갱신 후 비동기 통신
      spp: 5,
      key: null,
      word: null,
    };
    getArticleTotalLength(
      null,
      ({ data }) => {
        this.rows = data;
      },
      (error) => {
        console.log(error);
      }
    );
    listArticle(
      param,
      ({ data }) => {
        this.articles = data;
      },
      (error) => {
        console.log(error);
      }
    );
  },
  methods: {
    moveWrite() {
      this.$router.push({ name: "boardwrite" });
    },
    viewArticle(article) {
      this.$router.push({
        name: "boardview",
        params: { id: article.id },
      });
    },
  },
  watch: {
    currentPage: function () {
      console.log("change-currentPage");
      let param = {
        pg: this.currentPage, // 현재 페이지
        spp: 5, // 몇개씩
        key: null,
        word: null,
      };
      listArticle(
        param,
        ({ data }) => {
          this.articles = data;
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
};
</script>

<style scope>
.tdClass {
  width: 50px;
  text-align: center;
}
.tdSubject {
  width: 300px;
  text-align: left;
}
</style>
