<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert show><h3>글목록</h3></b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col><b-alert show variant="danger">삭제처리중...</b-alert></b-col>
    </b-row>
  </b-container>
</template>

<script>
import { deleteArticle } from "@/apis/board";

export default {
  name: "BoardDelete",
  created() {
    let param = this.$route.params.id;
    deleteArticle(
      param,
      (resp) => {
        let msg = "삭제 처리시 문제가 발생했습니다.";
        if (resp.status === 200) {
          msg = "삭제가 완료되었습니다.";
        }
        alert(msg);
        // 현재 route를 /list로 변경.
        this.$router.push({ name: "boardlist" });
      },
      async (error) => {
        console.log(error);
        if (error.response.status === 400) {
          alert("잘못된 접근입니다.");
        } else if (error.response.status === 401) {
          console.log("글삭제: 권한이 없습니다.. 토큰 재발행으로 go");
          await this.tokenRegeneration(); // 토큰 재발행 코드
          deleteArticle(
            param,
            (resp) => {
              let msg = "삭제 처리시 문제가 발생했습니다.";
              if (resp.status === 200) {
                msg = "삭제가 완료되었습니다.";
              }
              alert(msg);
              // 현재 route를 /list로 변경.
              this.$router.push({ name: "boardlist" });
            },
            async (error) => {
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
};
</script>

<style></style>
