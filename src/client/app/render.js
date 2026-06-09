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
import ThemeToggle from './config/ThemeToggle'
import { getLogoutUrl } from './utils'
import AIAnalysis from './ai/AIAnalysis'

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

  const plainTextLogs = logs.map(l => l.data[0] || '').filter(Boolean)

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
          <ThemeToggle />
          <LanguageSwitcher />
          <LogoutButton href={getLogoutUrl()}>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
              <polyline points='16 17 21 12 16 7' />
              <line x1='21' y1='12' x2='9' y2='12' />
            </svg>
            {t('logout')}
          </LogoutButton>
          <BackLink href={window.location.pathname}>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
              <line x1='19' y1='12' x2='5' y2='12' />
              <polyline points='12 19 5 12 12 5' />
            </svg>
            {t('backToSearch')}
          </BackLink>
        </HeaderControls>
      </Header>
      <Tabs>
        <TabList>
          <Tab>{t('statsTab')}</Tab>
          <Tab>{t('logsTab')}</Tab>
          <Tab>{t('aiTab')}</Tab>
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
            <Console logs={logs} variant='dark' />
          </ConsoleWrapper>
        </TabPanel>
        <TabPanel>
          <AIAnalysis logs={plainTextLogs} statsData={data} />
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
  background: var(--title-gradient);
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
  background: var(--input-bg);
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
    background: var(--input-bg-focus);
    border-color: var(--accent-color);
    box-shadow: 0 0 10px var(--accent-glow);
    transform: translateX(-2px);
  }
`

const LogoutButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
  text-decoration: none;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(239, 68, 68, 0.16);
    border-color: #ef4444;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.2);
    transform: translateY(-1px);
    color: #ffffff;
  }
`

const ConsoleWrapper = styled.div`
  background: #000000;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--panel-border);
  overflow: hidden;
`
