import Actions from './actions-types'

const initialState = {
  isSet: false,
  filesEndpoint: '',
  language: localStorage.getItem('language') || 'en'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.SetConfig:
      return { ...state, ...action.payload, isSet: true }
    case Actions.SetLanguage:
      localStorage.setItem('language', action.payload)
      return { ...state, language: action.payload }
    default:
      return state
  }
}

