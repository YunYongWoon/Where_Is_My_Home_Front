<template>
  <b-row class="mb-1">
    <b-col style="text-align: left">
      <b-form @submit="onSubmit" @reset="onReset">
        <!-- <b-form-group id="email-group" label="작성자:" label-for="email" description="email을 입력하세요.">
          <b-form-input
            id="email"
            :disabled="isUserid"
            v-model="article.userId"
            type="text"
            required
            placeholder="작성자 입력..."
          ></b-form-input>
        </b-form-group> -->

        <b-form-group id="title-group" label="제목:" label-for="title" description="제목을 입력하세요.">
          <b-form-input
            id="title"
            v-model="article.title"
            type="text"
            required
            placeholder="제목 입력..."
          ></b-form-input>
        </b-form-group>

        <b-form-group id="content-group" label="내용:" label-for="content">
          <b-form-textarea
            id="content"
            v-model="article.content"
            placeholder="내용 입력..."
            rows="10"
            max-rows="15"
          ></b-form-textarea>
        </b-form-group>

        <b-button type="submit" variant="primary" class="m-1" v-if="this.type === 'register'">글작성</b-button>
        <b-button type="submit" variant="primary" class="m-1" v-else>글수정</b-button>
        <b-button type="reset" variant="danger" class="m-1">초기화</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>
import { writeArticle, modifyArticle, getArticle } from "@/apis/board";
import { mapActions } from "vuex";

const userStore = "userStore";

export default {
  name: "BoardInputItem",
  data() {
    return {
      article: {
        id: 0,
        userId: -1, // ********* 현재 로그인 한 유저 id를 여기다 넣어야함 *********
        title: "",
        content: "",
      },
    };
  },
  props: {
    type: { type: String },
  },
  created() {
    if (this.type === "modify") {
      let param = this.$route.params.id;
      getArticle(
        param,
        ({ data }) => {
          this.article = data;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  },
  methods: {
    ...mapActions(userStore, ["tokenRegeneration", "userLogout"]),
    onSubmit(event) {
      event.preventDefault();

      let err = true;
      let msg = "";
      // !this.article.userId && ((msg = "작성자 입력해주세요"), (err = false), this.$refs.userId.focus());
      err && !this.article.title && ((msg = "제목 입력해주세요"), (err = false), this.$refs.title.focus());
      err && !this.article.content && ((msg = "내용 입력해주세요"), (err = false), this.$refs.content.focus());

      if (!err) alert(msg);
      else this.type === "register" ? this.registArticle() : this.modifyArticle();
    },
    onReset(event) {
      event.preventDefault();
      this.article.id = 0;
      this.article.title = "";
      this.article.content = "";
      this.moveList();
    },
    registArticle() {
      let param = {
        // userId: this.article.userId,
        title: this.article.title,
        content: this.article.content,
      };
      if (this.article.content === "") {
        alert("내용을 입력하세요!");
        return;
      }

      if (!confirm("작성 하시겠습니까?")) {
        return;
      }

      writeArticle(
        param,
        (resp) => {
          let msg = "등록 처리시 문제가 발생했습니다.";
          if (resp.status === 200) {
            msg = "등록이 완료되었습니다.";
          }
          alert(msg);
          this.moveList();
        },
        async (error) => {
          console.log(error);
          if (error.response.status === 400) {
            alert("잘못된 접근입니다.");
          } else if (error.response.status === 401) {
            console.log("글작성: 권한이 없습니다.. 토큰 재발행으로 go");
            await this.tokenRegeneration(); // 토큰 재발행 코드
            writeArticle(
              // 다시 호출
              param,
              (resp) => {
                let msg = "등록 처리시 문제가 발생했습니다.";
                if (resp.status === 200) {
                  msg = "등록이 완료되었습니다.";
                }
                alert(msg);
                this.moveList();
              },
              (error) => {
                console.log(error);
                if (error.response.status === 400) {
                  alert("잘못된 접근입니다.");
                } else if (error.response.status === 401) {
                  alert("인증이 만료되었습니다. 다시 로그인 해 주세요");
                  this.userLogout();
                }
              }
            );
          }
        }
      );
    },
    modifyArticle() {
      let param = {
        id: this.article.id,
        title: this.article.title,
        content: this.article.content,
      };
      if (this.article.content === "") {
        alert("내용을 입력하세요!");
        return;
      }

      if (!confirm("수정 하시겠습니까?")) {
        return;
      }
      modifyArticle(
        param,
        (resp) => {
          let msg = "수정 처리시 문제가 발생했습니다.";
          if (resp.status === 200) {
            msg = "수정이 완료되었습니다.";
          }
          alert(msg);
          // 현재 route를 /list로 변경.
          this.moveList();
        },
        async (error) => {
          console.log(error);
          if (error.response.status === 400) {
            alert("잘못된 접근입니다.");
          } else if (error.response.status === 401) {
            await this.tokenRegeneration();
            modifyArticle(
              param,
              (resp) => {
                let msg = "수정 처리시 문제가 발생했습니다.";
                if (resp.status === 200) {
                  msg = "수정이 완료되었습니다.";
                }
                alert(msg);
                // 현재 route를 /list로 변경.
                this.moveList();
              },
              (error) => {
                console.log(error);
                if (error.response.status === 400) {
                  alert("잘못된 접근입니다.");
                } else if (error.response.status === 401) {
                  alert("인증이 만료되었습니다. 다시 로그인 해 주세요");
                  this.userLogout();
                }
              }
            );
          }
        }
      );
    },
    moveList() {
      this.$router.push({ name: "boardlist" });
    },
  },
};
</script>

<style></style>
