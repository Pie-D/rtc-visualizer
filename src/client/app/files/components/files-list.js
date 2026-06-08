import React from 'react'
import { useSelector } from 'react-redux'

import { getSearchFinished } from '../../search/selectors'
import { getGroups } from '../selectors'
import ConferenceGroup from './conference-group'
import { useTranslation } from '../../locales'

export default () => {
  const { t } = useTranslation()
  const groups = useSelector(getGroups)
  const searchFinished = useSelector(getSearchFinished)
  const keys = Object.keys(groups).sort((first, second) => groups[second].startDate - groups[first].startDate)

  if (keys.length) {
    return (
      <div>
        {keys.map(key => <ConferenceGroup key={key} id={key} data={groups[key]} />)}
      </div>
    )
  }

  return searchFinished ? <div>{t('nothingFound')} <br />{t('tryNewSearch')} </div> : null
}
