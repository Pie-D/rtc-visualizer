import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { getSearchTimeVisible, getSearchTime } from '../selectors'
import { useTranslation } from '../../locales'

const Container = styled.div`
  font-size: 0.8em;
  margin-top: 12px;
`

export default () => {
  const { t } = useTranslation()
  const searchTimeVisible = useSelector(getSearchTimeVisible)
  const time = useSelector(getSearchTime)

  return (
    searchTimeVisible
      ? (
        <Container>
          <div><div>{t('searchTook', { time: time / 1000 })}</div></div>
        </Container>
        )
      : null
  )
}

