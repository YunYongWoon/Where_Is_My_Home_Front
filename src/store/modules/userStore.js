import jwtDecode from "jwt-decode";
import router from "@/router";
import {
  login,
  logout,
  tokenRegeneration,
  findById,
  register,
  checkEmail,
  sendRegisterMail,
  sendRegisterVerifyCode,
  deleteUser,
  sendPasswordCode,
  sendPasswordEmail,
  changePassword
} from "@/apis/user";

const userStore = {
  namespaced: true,
  state: {
    isLogin: false,
    isLoginError: false,
    isPasswordCode: false,
    isAuth: false,
    isVaildEmail: null,
    isEmailSend: false,
    userInfo: {
      userEmail: null,
      userNickname: null,
      userType: null,
    },
    isValidToken: false,
  },
  getters: {
    checkUserInfo: function (state) {
      return state.userInfo;
    },
    checkToken: function (state) {
      return state.isValidToken;
    },
  },
  mutations: {
    SET_IS_LOGIN: (state, isLogin) => {
      state.isLogin = isLogin;
    },
    SET_IS_LOGIN_ERROR: (state, isLoginError) => {
      state.isLoginError = isLoginError;
    },
    SET_IS_VALID_TOKEN: (state, isValidToken) => {
      state.isValidToken = isValidToken;
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_USER_EMAIL: (state, userEmail) => {
      state.userInfo.userEmail = userEmail;
    },
    SET_USER_NICKNAME: (state, nickname) => {
      state.userInfo.userNickname = nickname;
    },
    SET_USER_TYPE: (state, type) => {
      state.userInfo.userType = type;
    },
    SET_VALID_EMAIL: (state, valid) => {
      state.isVaildEmail = valid;
    },
    SET_IS_AUTH: (state, auth) => {
      state.isAuth = auth;
    },
    SET_IS_EMAIL_SEND: (state, send) => {
      state.isEmailSend = send;
    },
    SET_IS_PASSWORD_CODE: (state, send) => {
      state.isPasswordCode = send;
    }
  },
  actions: {
    async userConfirm({ commit }, user) {
      await login(
        user,
        (resp) => {
          if (resp.status === 200) {
            let data = resp.data;
            let accessToken = data["accessToken"];
            let refreshToken = data["refreshToken"];
            sessionStorage.setItem("access-token", accessToken);
            sessionStorage.setItem("refresh-token", refreshToken);
            let decodeToken = jwtDecode(accessToken);
            commit("SET_IS_LOGIN", true);
            commit("SET_IS_AUTH", true);
            commit("SET_IS_LOGIN_ERROR", false);
            commit("SET_IS_VALID_TOKEN", true);
            commit("SET_USER_EMAIL", user.email);
            commit("SET_USER_NICKNAME", decodeToken.nickname);
            commit("SET_USER_TYPE", decodeToken.role);
            router.push({ name: "main" });
          }
        },
        (error) => {
          if (error.response.status === 401) {
            alert("????????? ????????? ?????? ??????????????????.");
            commit("SET_IS_AUTH", false);
            commit("SET_USER_EMAIL", user.email);
            router.push({ name: "auth" });
          } else {
            console.log(error);
            commit("SET_IS_LOGIN", false);
            commit("SET_IS_AUTH", false);
            commit("SET_IS_LOGIN_ERROR", true);
            commit("SET_IS_VALID_TOKEN", false);
          }
        }
      );
    },
    async getUserInfo({ commit, dispatch }, token) {
      let decodeToken = jwtDecode(token);
      await findById(
        decodeToken.aud,
        ({ data }) => {
          if (data.message === "success") {
            commit("SET_USER_INFO", data.userInfo);
            // console.log("3. getUserInfo data >> ", data);
          } else {
            console.log("?????? ?????? ??????!!!!");
          }
        },
        async (error) => {
          console.log("getUserInfo() error code [?????? ???????????? ?????? ?????????.] ::: ", error.response.status);
          commit("SET_IS_VALID_TOKEN", false);
          await dispatch("tokenRegeneration");
        }
      );
    },
    async tokenRegeneration({ commit, state }) {
      console.log("?????? ?????????");
      await tokenRegeneration(
        JSON.stringify(state.userInfo),
        (response) => {
          console.log(response)
          if (response.status === 200) {
            let accessToken = response.data["accessToken"];
            sessionStorage.setItem("access-token", accessToken);
            commit("SET_IS_VALID_TOKEN", true);
          }
        },
        async (error) => {
          console.log(error);
          await logout(
            () => {
              commit("SET_IS_LOGIN", false);
              commit("SET_IS_AUTH", false);
              commit("SET_IS_LOGIN_ERROR", false);
              commit("SET_IS_VALID_TOKEN", false);
              sessionStorage.removeItem("access-token");
              sessionStorage.removeItem("refresh-token");
              alert("?????? ????????? ?????????????????????. ?????? ??????????????????.");
              router.push({ name: "login" });
            },
            () => {
              commit("SET_IS_LOGIN", false);
              commit("SET_IS_AUTH", false);
              commit("SET_IS_LOGIN_ERROR", false);
              commit("SET_IS_VALID_TOKEN", false);
              sessionStorage.removeItem("access-token");
              sessionStorage.removeItem("refresh-token");
              alert("?????? ????????? ?????????????????????. ?????? ??????????????????.");
              router.push({ name: "login" });
            }
          );
        }
      );
    },
    async userLogout({ commit }) {
      await logout(
        () => {
          commit("SET_IS_LOGIN", false);
          commit("SET_IS_AUTH", false);
          commit("SET_IS_LOGIN_ERROR", false);
          commit("SET_IS_VALID_TOKEN", false);
          sessionStorage.removeItem("access-token");
          sessionStorage.removeItem("refresh-token");
          alert("???????????? ??????");
          router.push({ name: "login" });
        },
        (error) => {
          commit("SET_IS_LOGIN", false);
          commit("SET_IS_AUTH", false);
          commit("SET_IS_LOGIN_ERROR", false);
          commit("SET_IS_VALID_TOKEN", false);
          sessionStorage.removeItem("access-token");
          sessionStorage.removeItem("refresh-token");
          console.log(error);
          router.push({ name: "login" });
        }
      );
    },
    async checkEmail({ commit }, email) {
      await checkEmail(
        email,
        (resp) => {
          if (resp.status === 200) {
            commit("SET_VALID_EMAIL", true);
            alert("?????? ????????? ???????????????.");
          }
        },
        (error) => {
          console.log(error);
          commit("SET_VALID_EMAIL", false);
        }
      );
    },
    async userRegister({ commit }, user) {
      await register(
        user,
        (resp) => {
          if (resp.status === 200) {
            commit("SET_USER_EMAIL", user.email);
            commit("SET_IS_AUTH", false);
            router.push({ name: "auth" });
          }
        },
        (error) => {
          console.log(error);
          alert("???????????? ??????");
        }
      );
    },
    async registerMail({ commit }, email) {
      await sendRegisterMail(
        { email: email },
        (resp) => {
          if (resp.status === 200) {
            commit("SET_IS_EMAIL_SEND", true);
            alert("????????? ?????????????????????. ??????????????????.");
          }
        },
        (error) => {
          console.log(error);
          alert(error.response.data);
          if (error.response.status === 401) {
            commit("SET_USER_EMAIL", null);
            commit("SET_IS_EMAIL_SEND", false);
            router.push({ name: "login" });
          }
        }
      );
    },
    async registerCode({ commit }, user) {
      await sendRegisterVerifyCode(
        user,
        (resp) => {
          if (resp.status === 200) {
            alert("????????? ?????????????????????. ?????? ?????????????????????");
            commit("SET_IS_EMAIL_SEND", false);
            router.push({ name: "login" });
          }
        },
        (error) => {
          console.log(error);
          if (error.response.status === 400) {
            alert("??????????????? ???????????? ????????? ???????????????.");
          } else if (error.response.status === 404) {
            commit("SET_IS_EMAIL_SEND", false);
            alert("????????? ???????????? ???????????????. ????????? ????????????.");
          }
        }
      );
    },
    async deleteUserBtn({ commit, dispatch }) {
      await deleteUser(
        () => {
          commit("SET_IS_LOGIN", false);
          commit("SET_IS_AUTH", false);
          commit("SET_IS_LOGIN_ERROR", false);
          commit("SET_IS_VALID_TOKEN", false);
          sessionStorage.removeItem("access-token");
          sessionStorage.removeItem("refresh-token");
          alert("?????????????????????.");
          router.push({ name: "main" });
        },
        async (error) => {
          if (error.response.status == 400) {
            await logout(
              () => {
                commit("SET_IS_LOGIN", false);
                commit("SET_IS_AUTH", false);
                commit("SET_IS_LOGIN_ERROR", false);
                commit("SET_IS_VALID_TOKEN", false);
                sessionStorage.removeItem("access-token");
                sessionStorage.removeItem("refresh-token");
                alert("?????? ????????? ?????????????????????. ");
                router.push({ name: "login" });
              },
              (error) => {
                commit("SET_IS_LOGIN", false);
                commit("SET_IS_AUTH", false);
                commit("SET_IS_LOGIN_ERROR", false);
                commit("SET_IS_VALID_TOKEN", false);
                sessionStorage.removeItem("access-token");
                sessionStorage.removeItem("refresh-token");
                console.log(error);
                router.push({ name: "login" });
              }
            );
          }
          if (error.response.status === 401) {
            await dispatch("tokenRegeneration");
            await dispatch("deleteUserBtn");
          }
        }
      );
    },
    async sendPwdCode({ commit }, user) {
      await sendPasswordCode(
        user,
        () => {
          alert("????????? ?????????????????????.");
          commit("SET_IS_PASSWORD_CODE", true);
          commit("SET_USER_EMAIL", user.email);
        },
        () => {
          alert("???????????? ???????????? ?????????, ????????? ?????????????????????.");
          commit("SET_IS_PASSWORD_CODE", false);
        }
      )
    },
    async sendNewPwd({ commit }, user) {
      await sendPasswordEmail(
        user,
        () => {
          alert("??????????????? ?????????????????????.")
          commit("SET_IS_PASSWORD_CODE", false);
          router.push({ name: 'login' });
        },
        (error) => {
          console.log(error);
          if (error.response.status === 404) {
            alert("?????? ?????? ????????? ????????????. ????????? ?????? ???????????????");
            commit("SET_IS_PASSWORD_CODE", false);
          } else if (error.response.status === 400) {
            alert("?????? ????????? ????????????. ?????? ??????????????????.");
          }
        }
      )
    },
    async changePwd({ commit, dispatch }, pwd) {
      await changePassword(
        pwd,
        async () => {
          alert("??????????????? ?????????????????????. ?????? ?????????????????????.")
          await logout(
            () => {
              commit("SET_IS_LOGIN", false);
              commit("SET_IS_AUTH", false);
              commit("SET_IS_LOGIN_ERROR", false);
              commit("SET_IS_VALID_TOKEN", false);
              sessionStorage.removeItem("access-token");
              sessionStorage.removeItem("refresh-token");
              router.push({ name: "login" });
            },
            (error) => {
              commit("SET_IS_LOGIN", false);
              commit("SET_IS_AUTH", false);
              commit("SET_IS_LOGIN_ERROR", false);
              commit("SET_IS_VALID_TOKEN", false);
              sessionStorage.removeItem("access-token");
              sessionStorage.removeItem("refresh-token");
              console.log(error);
              router.push({ name: "login" });
            }
          );
        },
        async (error) => {
          if (error.response.status === 401) {
            await dispatch("tokenRegeneration");
            await dispatch("changePwd", pwd);
          } else {
            console.log(error);
            alert(error.response.data);
          }
        }
      )
    }
  },
};

export default userStore;
