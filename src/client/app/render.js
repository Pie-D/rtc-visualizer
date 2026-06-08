import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { showStats } from './raw/legacy'
import { getFileStatus } from './files/selectors'
import { Console } from 'console-feed'
import { fetchFileBasicAuth, fetchFileJWTAuth } from './files/actions'
import { useTranslation } from './locales'
import LanguageSwitcher from './config/LanguageSwitcher'

export default () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const dumpId = params.get('dumpId')
    const useJWTAuthorization = params.get('useJWTAuthorization')
    if (dumpId) {
      if (useJWTAuthorization) {
        dispatch(fetchFileJWTAuth(dumpId))
      } else {
        dispatch(fetchFileBasicAuth(dumpId))
      }
    }
  }, [dispatch])

  const { data } = useSelector(getFileStatus) || { }

  let logs = []
  if (data) {
    if (data.peerConnections.null) {
      logs = data.peerConnections.null
        .filter(msg => msg.type === 'logs')
        .reduce((accumulator, currentValue) => accumulator.concat(currentValue.value), [])
        .map(msg => ({ method: 'log', data: [msg.text] }))
    }
    showStats(data)
  }

  const urlParams = new URLSearchParams(window.location.search)
  const currentDumpId = urlParams.get('dumpId')

  return (
    <RenderContainer>
      <Header>
        <TitleContainer>
          <Title>{t('sessionAnalysis')}</Title>
          <Subtitle>{t('dumpId')} {currentDumpId}</Subtitle>
        </TitleContainer>
        <HeaderControls>
          <LanguageSwitcher />
          <BackLink href={window.location.pathname}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            {t('backToSearch')}
          </BackLink>
        </HeaderControls>
      </Header>
      <Tabs>
        <TabList>
          <Tab>{t('statsTab')}</Tab>
          <Tab>{t('logsTab')}</Tab>
        </TabList>
        <TabPanel forceRender>
          <div id='raw'>
            <div id='userAgent' />
            <div id='tables' />
            <div id='container' />
          </div>
        </TabPanel>
        <TabPanel>
          <ConsoleWrapper>
            <Console logs={logs} variant="dark" />
          </ConsoleWrapper>
        </TabPanel>
      </Tabs>
    </RenderContainer>
  )
}

const RenderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--panel-border);
  padding-bottom: 24px;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.h1`
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(90deg, #ffffff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Subtitle = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 4px;
  word-break: break-all;
`

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 576px) {
    width: 100%;
    justify-content: space-between;
  }
`

const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--panel-border);
  color: var(--text-primary);
  text-decoration: none;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 0.9rem;
  padding: 10px 18px;
  border-radius: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--accent-color);
    box-shadow: 0 0 10px var(--accent-glow);
    transform: translateX(-2px);
  }
`

const ConsoleWrapper = styled.div`
  background: #000000;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--panel-border);
  overflow: hidden;
`


