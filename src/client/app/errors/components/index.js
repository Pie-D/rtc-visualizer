import React from 'react'
import styled from 'styled-components'
import errorType from '../error-types'
import { useTranslation } from '../../locales'

const Container = styled.div`
  color: red;
`

export default ({ type, error }) => {
  const { t } = useTranslation()

  const textErrorMap = {
    [errorType.Fetch]: t('errorFetch'),
    [errorType.Parse]: t('errorParse'),
    [errorType.Status]: t('errorStatus')
  }

  const text = textErrorMap[type] || ''

  return <Container>{`${text} ${error}`}</Container>
}
