// axios 코드 여기다 몰아놓음

import { apiInstance } from "./index.js";

const api = apiInstance();

function listArticle(param, success, fail) {
  api.get(`/board`, { params: param }).then(success).catch(fail);
}

function writeArticle(article, success, fail) {
  api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
  api.post(`/board/write`, JSON.stringify(article)).then(success).catch(fail);
}

function getArticle(articleno, success, fail) {
  api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
  api.get(`/board/${articleno}`).then(success).catch(fail);
}

function modifyArticle(article, success, fail) {
  api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
  api.put(`/board`, JSON.stringify(article)).then(success).catch(fail);
}

function deleteArticle(articleno, success, fail) {
  api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
  api.delete(`/board/${articleno}`).then(success).catch(fail);
}

function getArticleTotalLength(param, success, fail) {
  api.get(`/board/length`, { params: param }).then(success).catch(fail);
}

function addComment(article, success, fail) {
  api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
  api.post(`/board/comment`, JSON.stringify(article)).then(success).catch(fail);
}

function getComments(articleno, success, fail) {
  api.get(`/board/${articleno}/comment`).then(success).catch(fail);
}

function deleteComment(articleno, success, fail) {
  api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
  api.delete(`/board/comment/${articleno}`).then(success).catch(fail);
}

function modifyComment(article, success, fail) {
  api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
  api.put(`/board/comment`, JSON.stringify(article)).then(success).catch(fail);
}

export {
  listArticle,
  writeArticle,
  getArticle,
  modifyArticle,
  deleteArticle,
  getArticleTotalLength,
  addComment,
  getComments,
  deleteComment,
  modifyComment,
};