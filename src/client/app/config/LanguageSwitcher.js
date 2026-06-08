import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import Actions from './actions-types'

const SwitcherButton = styled.button`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--panel-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 44px;
  height: 44px;
  border-radius: 12px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px) scale(1.05);
    border-color: var(--accent-color);
    box-shadow: 0 0 12px var(--accent-glow);
  }

  &:active {
    transform: translateY(0) scale(0.95);
  }

  .flag-wrapper {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.4);
  }
`

const VietnamFlag = () => (
  <svg viewBox="0 0 30 20">
    <rect width="30" height="20" fill="#da251d" />
    <polygon points="15,4 16.18,7.63 20,7.63 16.91,9.88 18.09,13.5 15,11.25 11.91,13.5 13.09,9.88 10,7.63 13.82,7.63" fill="#ffff00" />
  </svg>
)

const UKFlag = () => (
  <svg viewBox="0 0 60 30">
    <clipPath id="s">
      <rect width="60" height="30" />
    </clipPath>
    <rect width="60" height="30" fill="#012169" />
    <path d="M0 0l60 30M60 0L0 30" stroke="#fff" strokeWidth="6" />
    <path d="M0 0l60 30M60 0L0 30" stroke="#c8102e" strokeWidth="4" clipPath="url(#s)" />
    <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
    <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
  </svg>
)

export default () => {
  const dispatch = useDispatch()
  const language = useSelector(state => state.config.language) || 'en'

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'vi' : 'en'
    dispatch({
      type: Actions.SetLanguage,
      payload: nextLang
    })
  }

  const tooltipText = language === 'en'
    ? 'Switch to Tiếng Việt'
    : 'Switch to English'

  return (
    <SwitcherButton
      onClick={toggleLanguage}
      title={tooltipText}
    >
      <div className="flag-wrapper">
        {language === 'en' ? <UKFlag /> : <VietnamFlag />}
      </div>
    </SwitcherButton>
  )
}

