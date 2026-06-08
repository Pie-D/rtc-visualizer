export const getSearchParams = state => {
  const { params } = state.search

  if (params) {
    return Object.entries(params).filter(([, value]) => Boolean(value)).reduce((res, [name, value]) => {
      return `${res} ${name}: ${value}`
    }, '')
  }

  return ''
}

export const getSearchInProgress = state => state.search.searchInProgress

export const getSearchError = state => state.search.error

export const getSearchFinished = state => state.search.searchFinished

export const getSearchTime = ({ search: { startSearchTime, endSearchTime } }) => (endSearchTime - startSearchTime)

export const getSearchTimeVisible = ({ search: { searchInProgress, searchFinished } }) => searchFinished && !searchInProgress

export const getRawSearchParams = state => state.search.params
export const getSearchTotal = state => state.search.total || 0
export const getSearchPage = state => state.search.page || 1
export const getSearchLimit = state => state.search.limit || 10
