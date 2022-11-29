import { apiInstance } from "./index.js";

const api = apiInstance();

function sidoList(success, fail) {
	api.get(`/map/sido`).then(success).catch(fail);
}

function gugunList(params, success, fail) {
	api.get(`/map/gugun`, { params: params }).then(success).catch(fail);
}

function dongList(params, success, fail) {
	api.get(`/map/dong`, { params: params }).then(success).catch(fail);
}

function houseList(params, success, fail) {
	if (sessionStorage.getItem("access-token") != null) {
		api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
	}
	api.get(`/map/apt`, { params: params }).then(success).catch(fail);
}

function houseDealList(aptCode, params, success, fail) {
	api.get(`/map/apt/${aptCode}/deal`, { params: params }).then(success).catch(fail);
}

function addFavoriteApt(aptCode, success, fail) {
	api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
	api.post(`/map/favorite`, JSON.stringify(aptCode)).then(success).catch(fail);
}

function removeFavoriteApt(id, success, fail) {
	api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
	api.delete(`/map/favorite/${id}`).then(success).catch(fail);
}

function getAllFavoriteArea(success, fail) {
	api.defaults.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access-token");
	api.get(`/map/favorite`).then(success).catch(fail);
}

export { getAllFavoriteArea, sidoList, gugunList, dongList, houseList, houseDealList, addFavoriteApt, removeFavoriteApt };