import React from 'react'
import styled from 'styled-components'
import { FilesList } from './files/components'
import { SearchForm, Pagination } from './search/components'
import { useTranslation } from './locales'
import LanguageSwitcher from './config/LanguageSwitcher'


const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--panel-border);
  padding-bottom: 24px;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const Logo = styled.div`
   background: #ffffff; 
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px var(--accent-glow);
`

const LogoIcon = () => (
  <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
    width="72.000000pt" height="72.000000pt" viewBox="0 0 72.000000 72.000000"
    preserveAspectRatio="xMidYMid meet">

    <g transform="translate(0.000000,72.000000) scale(0.100000,-0.100000)"
      fill="#008ff3" stroke="none">
      <path d="M101 554 c-19 -25 -21 -40 -21 -195 0 -92 3 -175 6 -184 14 -37 57
-45 229 -45 163 0 166 0 190 25 15 14 25 36 25 53 0 25 -9 34 -84 76 -47 26
-87 52 -89 59 -3 8 -9 6 -19 -7 -28 -35 -86 3 -62 42 15 24 38 26 59 6 10 -11
19 -13 23 -7 4 5 44 31 90 57 73 43 82 51 82 77 0 16 -9 38 -20 49 -19 19 -33
20 -204 20 l-185 0 -20 -26z m250 -54 c20 -6 43 -18 52 -28 15 -17 15 -19 -12
-35 -23 -14 -33 -14 -60 -4 -26 10 -37 9 -59 -3 -82 -47 -29 -176 59 -143 26
10 37 9 62 -4 l31 -16 -23 -18 c-13 -10 -40 -24 -62 -30 -32 -10 -46 -9 -84 5
-58 23 -88 64 -92 130 -5 65 21 110 80 136 49 23 59 23 108 10z"/>
      <path d="M573 499 l-33 -21 0 -121 0 -122 31 -17 c38 -22 65 -23 73 -2 3 9 6
75 6 148 0 163 -9 179 -77 135z"/>
    </g>
  </svg>
)

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.h1`
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(90deg, #ffffff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
`

const Card = styled.div`
  background: var(--panel-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--panel-border);
  border-radius: 20px;
  padding: 30px;
  box-shadow: var(--card-shadow);
  margin-bottom: 30px;
  position: relative;
  z-index: 10;
`

export default () => {
  const { t } = useTranslation()

  return (
    <DashboardContainer>
      <Header>
        <HeaderLeft>
          <Logo>
            <LogoIcon />
          </Logo>
          <HeaderText>
            <Title>RTC Visualizer</Title>
            <Subtitle>{t('dashboardSubtitle')}</Subtitle>
          </HeaderText>
        </HeaderLeft>
        <LanguageSwitcher />
      </Header>
      <Card>
        <SearchForm />
      </Card>
      <FilesList />
      <Pagination />
    </DashboardContainer>
  )
}


