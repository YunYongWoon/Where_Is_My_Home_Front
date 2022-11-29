import { apiInstance } from "./index.js";

const api = apiInstance();

async function login(user, success, fail) {
	await api.post(`/user/login`, JSON.stringify(user)).then(success).catch(fail);
}

async function findById(userid, success, fail) {
	api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
	await api.get(`/user/info/${userid}`).then(success).catch(fail);
}

async function tokenRegeneration(user, success, fail) {
	api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("refresh-token"); //axios header에 refresh-token 셋팅
	await api.get(`/user/refresh`, user).then(success).catch(fail);
}

async function logout(success, fail) {
	api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
	await api.get(`/user/logout`).then(success).catch(fail);
}

async function register(user, success, fail) {
	await api.post(`/user/signUp`, JSON.stringify(user)).then(success).catch(fail);
}

async function checkEmail(params, success, fail) {
	await api.get(`/user/signUp/checkEmail`, { params }).then(success).catch(fail);
}

async function sendRegisterMail(user, success, fail) {
	await api.post(`/user/signUp/sendMail`, JSON.stringify(user)).then(success).catch(fail);
}

async function sendRegisterVerifyCode(user, success, fail) {
	await api.post(`/user/signUp/verify`, JSON.stringify(user)).then(success).catch(fail);
}

async function deleteUser(success, fail) {
	api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
	await api.delete(`/user`).then(success).catch(fail);
}

async function sendPasswordCode(user, success, fail) {
	await api.post(`/user/password/sendmail`, JSON.stringify(user)).then(success).catch(fail);
}

async function sendPasswordEmail(user, success, fail) {
	await api.post(`/user/password/verify`, JSON.stringify(user)).then(success).catch(fail);
}

async function changePassword(pwd, success, fail) {
	api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
	await api.post(`/user`, JSON.stringify(pwd)).then(success).catch(fail);
}

export { changePassword, login, findById, tokenRegeneration, logout, register, checkEmail, sendRegisterMail, sendRegisterVerifyCode, deleteUser, sendPasswordCode, sendPasswordEmail };
