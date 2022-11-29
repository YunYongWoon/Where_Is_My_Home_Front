import { getAllFavoriteArea, sidoList, gugunList, dongList, houseList, houseDealList, addFavoriteApt, removeFavoriteApt } from "@/apis/map";

const mapStore = {
	namespaced: true,
	state: {
		sidos: [{ value: null, text: "선택하세요" }],
		guguns: [{ value: null, text: "선택하세요" }],
		dongs: [{ value: null, text: "선택하세요" }],
		houses: [],
		house: null,
		marker: [],
		deals: [],
		modal: false,
		hasNextData: true,
		nextCur: -1,
	},
	getters: {},
	mutations: {
		CLEAR_SIDO_LIST(state) {
			state.sidos = [{ value: null, text: "선택하세요" }];
		},
		CLEAR_GUGUN_LIST(state) {
			state.guguns = [{ value: null, text: "선택하세요" }];
		},
		CLEAR_DONG_LIST(state) {
			state.dongs = [{ value: null, text: "선택하세요" }];
		},
		CLEAR_APT_LIST(state) {
			state.houses = [];
			state.house = null;
		},
		SET_SIDO_LIST(state, sidos) {
			sidos.forEach((sido) => {
				state.sidos.push({ value: sido.sidoName, text: sido.sidoName });
			});
		},
		SET_GUGUN_LIST(state, guguns) {
			guguns.forEach((gugun) => {
				state.guguns.push({ value: gugun.gugunName, text: gugun.gugunName });
			});
		},
		SET_DONG_LIST(state, dongs) {
			dongs.forEach((dong) => {
				state.dongs.push({ value: dong.dongCode, text: dong.dongName });
			});
		},
		SET_HOUSE_LIST(state, houses) {
			state.houses = houses;
		},
		SET_DETAIL_HOUSE(state, house) {
			state.house = house;
		},
		SET_MARKER(state, marker) {
			state.marker = marker;
		},
		SET_MODAL(state, modal) {
			state.modal = modal;
			if (!modal) {
				state.deals = [];
			}
		},
		SET_DEALS(state, deals) {
			deals.forEach((deal) => {
				state.deals.push(deal);
			})
		},
		SET_HAS_NEXT_DATA(state, hasNext) {
			state.hasNextData = hasNext;
		},
		SET_NEXT_CUR(state, cur) {
			state.nextCur = cur;
		},
		CHANGE_LIKE_STATE(state, data) {
			state.houses.forEach((house) => {
				if (house.aptCode == data.aptCode) {
					house.id = data.id;
				}
			})
		},
		CHANGE_DISLIST_STATE(state, id) {
			state.houses.forEach((house) => {
				if (house.id == id) {
					house.id = 0;
				}
			})
		}
	},
	actions: {
		getSido: ({ commit }) => {
			sidoList(
				({ data }) => {
					commit("SET_SIDO_LIST", data);
				},
				(error) => {
					console.log(error);
				}
			);
		},
		getGugun: ({ commit }, sidoName) => {
			const params = { sidoName };
			gugunList(
				params,
				({ data }) => {
					commit("SET_GUGUN_LIST", data);
				},
				(error) => {
					console.log(error);
				}
			);
		},
		getDong: ({ commit }, input) => {
			dongList(
				input,
				({ data }) => {
					commit("SET_DONG_LIST", data);
				},
				(error) => {
					console.log(error);
				}
			);
		},
		getHouseList: ({ commit }, dongCode) => {
			const params = {
				dongCode
			};
			houseList(
				params,
				({ data }) => {
					console.log(data);
					commit("SET_HOUSE_LIST", data);
				},
				async (error) => {
					console.log(error);
				}
			);
		},
		detailHouse: ({ commit }, house) => {
			const params = {
				cur: -1
			}
			houseDealList(
				house.aptCode,
				params,
				({ data }) => {
					commit("SET_DETAIL_HOUSE", house);
					commit("SET_MODAL", true);
					commit("SET_DEALS", data.deals);
					commit("SET_HAS_NEXT_DATA", data.hasNextData)
					if (data.hasNextData) {
						commit("SET_NEXT_CUR", data.cur);
					}
				},
				(error) => {
					console.log(error);
				}
			)
		},
		getMoreData: ({ commit }, house) => {
			const params = {
				cur: house.cur
			}
			houseDealList(
				house.aptCode,
				params,
				({ data }) => {
					commit("SET_DEALS", data.deals);
					commit("SET_HAS_NEXT_DATA", data.hasNextData)
					if (data.hasNextData) {
						commit("SET_NEXT_CUR", data.cur);
					}
				},
				(error) => {
					console.log(error);
				}
			)
		},
		likeApt: ({ commit, dispatch }, aptCode) => {
			addFavoriteApt(
				{ aptCode: aptCode },
				(data) => {
					console.log(data.data);
					commit("CHANGE_LIKE_STATE", data.data);
				},
				async (error) => {
					console.log(error);
					if (error.response.status === 401) {
						await dispatch("userStore/tokenRegeneration", null, { root: true });
						await dispatch("likeApt", aptCode);
					} else {
						console.log(error);
					}
				}
			)

		},
		dislikeApt: ({ commit, dispatch }, id) => {
			console.log(id);
			removeFavoriteApt(
				id,
				(response) => {
					commit("CHANGE_DISLIST_STATE", id);
					console.log(response)
				},
				async (error) => {
					if (error.response.status === 401) {
						await dispatch("userStore/tokenRegeneration", null, { root: true });
						await dispatch("dislikeApt", id);
					} else {
						console.log(error);
					}
				}
			)
		},
		getFavoriteAptList({ commit, dispatch }) {
			getAllFavoriteArea(
				({ data }) => {
					console.log(data);
					commit("SET_HOUSE_LIST", data);
				},
				async (error) => {
					if (error.response.status === 401) {
						await dispatch("userStore/tokenRegeneration", null, { root: true });
						await dispatch("getFavoriteAptList");
					} else {
						console.log(error);
					}
				}
			)
		}
	},
}

export default mapStore;