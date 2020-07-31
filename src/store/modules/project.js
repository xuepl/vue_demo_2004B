const state = {
  projectId: ''
}

const mutations = {
  setProjectId: (state, val) => {
    state.projectId = val
  }
}

const actions = {
  setProjectId({ commit }, val) {
    commit('setProjectId', val)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
