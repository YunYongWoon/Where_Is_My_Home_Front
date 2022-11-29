<template>
  <b-container class="bv-example-row mt-3">
    <b-row class="mb-1">
      <b-col class="text-left">
        <b-button variant="outline-primary" @click="moveList">목록</b-button>
      </b-col>
      <!-- vif 부분 현재 로그인한 userId랑 비교하도록 수정!!! -->
      <b-col class="text-right" v-if="loginUserId === article.userId">
        <b-button variant="outline-info" size="sm" @click="moveModifyArticle" class="mr-2">글수정</b-button>
        <b-button variant="outline-danger" size="sm" @click="deleteArticle">글삭제</b-button>
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col>
        <b-card
          :header-html="`<h4>${article.id}.
              ${article.title}</h4><div><h6>작성자: ${article.nickname} | 조회수: ${article.hit}</div><div>수정일: ${article.updatedAt}</h6></div>`"
          class="mb-2"
          border-variant="dark"
          no-body
        >
          <b-card-body class="text-left">
            <div v-html="message"></div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <div class="card mb-2">
      <div class="card-header bg-light"><i class="fa fa-comment fa"></i> REPLY</div>
      <div class="card-body">
        <b-row>
          <b-col cols="10">
            <textarea
              v-model="commentContent"
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="1"
            ></textarea>
          </b-col>
          <b-col cols="2"><b-button variant="primary" @click="onAddComment">댓글추가</b-button></b-col>
        </b-row>
        <br />

        <!-- vfor로 댓글 정보 출력  -->
        <b-row align-v="center" v-for="(comment, index) in comments" :key="index">
          <!-- vif - 삭제된 메세지가 아닐 때 -->

          <div v-if="comment.isDeleted === false">
            <b-col align-self="start" cols="10">
              <b-card>
                <b-col cols="2">
                  <h5>{{ comment.nickname }}</h5>
                </b-col>
                <b-col cols="10">
                  <!-- <b-form-input v-if="modifyFlag === false" readonly v-model="comment.content"></b-form-input> -->
                  <b-card bg-variant="Light" text-variant="black">
                    <b-card-text>{{ comment.content }}</b-card-text>
                  </b-card>
                </b-col>
              </b-card>
              <!-- 댓글의 userId와 로그인한 사용자의 userId가 같을때만 보이도록  -->
              <b-col cols="2" v-if="loginUserId === comment.userId">
                <b-button v-b-modal.comment-modify-modal @click="passDataToModal(comment.id)" variant="warning"
                  >수정</b-button
                >
                <b-button variant="danger" @click="onDeleteComment(comment.id)">삭제</b-button>
              </b-col>
              <b-col cols="2" v-else> </b-col>
              <br />
            </b-col>
          </div>

          <div v-else>
            <!-- velse - 삭제된 메세지 일 때 -->
            <b-card bg-variant="secondary" text-variant="white" class="text-center">
              <b-card-text>삭제된 메세지입니다.</b-card-text>
            </b-card>
            <br />
          </div>
        </b-row>
      </div>
    </div>

    <b-modal id="comment-modify-modal">
      <template #modal-title> 댓글 수정 입력창 </template>
      <input v-model="modifyCommentContent" type="text" />
      <b-button variant="primary" @click="onCommentModify(modifyCommentContent)">수정완료</b-button>
    </b-modal>
  </b-container>
</template>

<script>
import { mapActions } from "vuex";
// import moment from "moment";
import { getArticle, addComment, getComments, deleteComment, modifyComment } from "@/apis/board";
import { mapState } from "vuex";
import jwtDecode from "jwt-decode";

const userStore = "userStore";

export default {
  name: "BoardDetail",
  data() {
    return {
      articleNickname: "",
      loginUserId: -1,
      article: {},
      commentContent: "",
      comments: [],
      modifyCommentId: -1, // 현재 댓글의 정보를 여기다가 임시로 가져오고, 모덜에서 이 데이터를 참조하여 비동기 통신 파라미터 구성
      modifyCommentContent: "",
    };
  },
  computed: {
    ...mapState(userStore, ["userInfo"]), // 유저정보 가져오기
    message() {
      if (this.article.content) return this.article.content.split("\n").join("<br>");
      return "";
    },
  },
  created() {
    let param = this.$route.params.id; // 2. 이거 가지고 가서 서버에서 닉네임 포함된 article 가져와야 함
    let token = sessionStorage.getItem("access-token");
    let decodeToken = jwtDecode(token);
    this.loginUserId = parseInt(decodeToken.aud);

    getArticle(
      param,
      ({ data }) => {
        console.log(data);
        this.article = data;
        console.log(">>>>>>>>>>>");
        console.log(this.article);
      },
      async (error) => {
        console.log(error);
        if (error.response.status === 400) {
          alert("잘못된 접근입니다.");
        } else if (error.response.status === 401) {
          console.log("글 상세보기: 권한이 없습니다.. 토큰 재발행으로 go");
          await this.tokenRegeneration(); // 토큰 재발행 코드
          getArticle(
            param,
            ({ data }) => {
              this.article = data;
              console.log(data);
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

    this.getCommentList(); // 댓글정보 가져오기
  },
  methods: {
    ...mapActions(userStore, ["tokenRegeneration", "userLogout"]),
    moveModifyArticle() {
      this.$router.replace({
        name: "boardmodify",
        params: { id: this.article.id },
      });
      //   this.$router.push({ path: `/board/modify/${this.article.articleno}` });
    },
    deleteArticle() {
      if (confirm("정말로 삭제?")) {
        this.$router.replace({
          name: "boarddelete",
          params: { id: this.article.id },
        });
      }
    },
    getCommentList() {
      // 현재 글에 등록된 모든 댓글 가져오기
      let param = this.$route.params.id;
      getComments(
        param,
        ({ data }) => {
          this.comments = data;
          // console.log(this.comments);
        },
        (error) => {
          console.log(error);
        }
      );
      // this.$router.go(); // 페이지 새로고침
    },
    moveList() {
      this.$router.push({ name: "boardlist" });
    },
    onAddComment() {
      let param = {
        postId: this.$route.params.id,
        content: this.commentContent,
      };

      if (this.commentContent === "") {
        alert("댓글 내용을 입력하세요!");
        return;
      }

      if (!confirm("등록 하시겠습니까?")) {
        return;
      }

      addComment(
        param,
        (resp) => {
          let msg = "댓글 등록 처리시 문제가 발생했습니다.";
          if (resp.status === 200) {
            msg = "등록이 완료되었습니다.";
            this.commentContent = "";
          }
          alert(msg);
          this.getCommentList();
        },
        async (error) => {
          console.log(error);
          if (error.response.status === 400) {
            alert("잘못된 접근입니다.");
          } else if (error.response.status === 401) {
            console.log("댓글 추가: 권한이 없습니다.. 토큰 재발행으로 go");
            await this.tokenRegeneration(); // 토큰 재발행 코드
            addComment(
              param,
              (resp) => {
                let msg = "댓글 등록 처리시 문제가 발생했습니다.";
                if (resp.status === 200) {
                  msg = "등록이 완료되었습니다.";
                  this.commentContent = "";
                }
                alert(msg);
                this.getCommentList();
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
    onDeleteComment(commentId) {
      let param = commentId;

      if (!confirm("삭제 하시겠습니까?")) {
        return;
      }
      deleteComment(
        param,
        (resp) => {
          let msg = "댓글 삭제 처리시 문제가 발생했습니다.";
          if (resp.status === 200) {
            msg = "댓글 삭제가 완료되었습니다.";
          }
          alert(msg);
          this.getCommentList();
        },
        async (error) => {
          console.log(error);
          if (error.response.status === 400) {
            alert("잘못된 접근입니다.");
          } else if (error.response.status === 401) {
            console.log("댓글 삭제: 권한이 없습니다.. 토큰 재발행으로 go");
            await this.tokenRegeneration(); // 토큰 재발행 코드
            deleteComment(
              param,
              (resp) => {
                let msg = "댓글 삭제 처리시 문제가 발생했습니다.";
                if (resp.status === 200) {
                  msg = "댓글 삭제가 완료되었습니다.";
                }
                alert(msg);
                this.getCommentList();
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
    onCommentModify(commentContent) {
      let param = {
        id: this.modifyCommentId,
        content: commentContent,
      };
      if (commentContent === "") {
        alert("댓글 내용을 입력하세요!");
        return;
      }

      if (!confirm("수정 하시겠습니까?")) {
        return;
      }
      modifyComment(
        param,
        (resp) => {
          this.modifyCommentId = -1;
          // this.$refs["comment-modify-modal"].hide();
          this.$bvModal.hide("comment-modify-modal");
          let msg = "댓글 수정 처리시 문제가 발생했습니다.";
          if (resp.status === 200) {
            msg = "댓글 수정이 완료되었습니다.";
          }
          alert(msg);
          this.getCommentList();
        },
        async (error) => {
          console.log(error);
          if (error.response.status === 400) {
            alert("잘못된 접근입니다.");
          } else if (error.response.status === 401) {
            console.log("댓글 수정: 권한이 없습니다.. 토큰 재발행으로 go");
            await this.tokenRegeneration(); // 토큰 재발행 코드
            modifyComment(
              param,
              (resp) => {
                this.modifyCommentId = -1;
                // this.$refs["comment-modify-modal"].hide();
                this.$bvModal.hide("comment-modify-modal");
                let msg = "댓글 수정 처리시 문제가 발생했습니다.";
                if (resp.status === 200) {
                  msg = "댓글 수정이 완료되었습니다.";
                }
                alert(msg);
                this.getCommentList();
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
    passDataToModal(curCommentId) {
      this.modifyCommentId = curCommentId;
    },
  },
  // filters: {
  //   dateFormat(regtime) {
  //     return moment(new Date(regtime)).format("YY.MM.DD hh:mm:ss");
  //   },
  // },
};
</script>

<style></style>
