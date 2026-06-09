import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useTranslation } from '../locales'
import { makeRequest, Urls } from '../requests'

// Animations
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 10px rgba(0, 143, 243, 0.4); }
  50% { transform: scale(1.02); box-shadow: 0 0 25px rgba(0, 143, 243, 0.8), 0 0 15px rgba(0, 245, 212, 0.5); }
  100% { transform: scale(1); box-shadow: 0 0 10px rgba(0, 143, 243, 0.4); }
`

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const textPulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`

// Components
const GlassCard = styled.div`
  background: rgba(22, 27, 37, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--panel-border);
  border-radius: 16px;
  padding: 30px;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(0, 143, 243, 0.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`

const IntroSection = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

const RoboIconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-green) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px var(--accent-glow);
  margin-bottom: 10px;
  color: #ffffff;
  animation: ${pulse} 4s infinite ease-in-out;
`

const AnalyzeButton = styled.button`
  background: linear-gradient(90deg, #6366f1, #3b82f6, #10b981);
  background-size: 200% auto;
  color: white;
  border: none;
  padding: 16px 36px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  transition: all 0.4s ease;
  animation: ${pulse} 3s infinite ease-in-out;

  &:hover {
    background-position: right center;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background: #4b5563;
    cursor: not-allowed;
    box-shadow: none;
    animation: none;
  }
`

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  gap: 20px;
`

const LoadingBarContainer = styled.div`
  width: 250px;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
`

const LoadingBar = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--accent-color), var(--accent-green));
  position: absolute;
  left: -100%;
  animation: ${shimmer} 1.5s infinite linear;
  background-size: 200% 100%;
`

const LoadingText = styled.div`
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--text-primary);
  animation: ${textPulse} 1.5s infinite ease-in-out;
  text-align: center;
`

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 20px;
  border-radius: 12px;
  font-weight: 500;
  margin-top: 20px;
`

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--panel-border);
  padding-bottom: 16px;
  margin-bottom: 24px;
`

const ReportTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--accent-green);
`

const ReAnalyzeButton = styled.button`
  background: transparent;
  border: 1px solid var(--panel-border);
  color: var(--text-secondary);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--accent-color);
    color: var(--text-primary);
    background: rgba(0, 143, 243, 0.05);
  }
`

const ReportContent = styled.div`
  color: var(--text-primary);
  font-size: 1.05rem;
  line-height: 1.7;

  h3 {
    color: var(--accent-blue);
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 28px;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 6px;
  }

  p {
    margin: 12px 0;
  }

  ul, ol {
    margin: 12px 0 20px 24px;
    padding: 0;
  }

  li {
    margin-bottom: 8px;
  }

  code {
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9em;
    color: #e5c07b;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  pre {
    background: rgba(0, 0, 0, 0.45);
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    border: 1px solid var(--panel-border);
    margin: 16px 0;
    
    code {
      background: transparent;
      padding: 0;
      border: none;
      color: #abb2bf;
    }
  }

  blockquote {
    border-left: 4px solid var(--accent-color);
    background: rgba(0, 143, 243, 0.05);
    padding: 12px 20px;
    margin: 16px 0;
    border-radius: 0 8px 8px 0;
  }
`

export default function AIAnalysis ({ logs, statsData }) {
  const { t } = useTranslation()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!logs || logs.length === 0) {
      setError(t('aiEmptyLogs'))
      return
    }

    setLoading(true)
    setError(null)

    // Build stats summary description
    let statsSummary = null
    if (statsData) {
      statsSummary = {}
      try {
        if (statsData.userAgent) {
          statsSummary.userAgent = statsData.userAgent
        }
        if (statsData.peerConnections) {
          statsSummary.peerConnectionsCount = Object.keys(statsData.peerConnections).length
          // Summarize peer connections basic state
          statsSummary.peerConnections = {}
          Object.keys(statsData.peerConnections).forEach(pcName => {
            const pcData = statsData.peerConnections[pcName]
            statsSummary.peerConnections[pcName] = {
              hasIceFailure: JSON.stringify(pcData).includes('failed') || JSON.stringify(pcData).includes('FAILED'),
              statsCount: Array.isArray(pcData) ? pcData.length : 0
            }
          })
        }
      } catch (e) {
        // Suppress errors during parsing summary, send basic details
      }
    }

    try {
      const response = await makeRequest(Urls.Analyze(), 'POST', {
        logs,
        statsSummary
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.details || data.error)
      }

      setAnalysis(data.analysis)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const parseBoldText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: 'var(--accent-green)' }}>{part.slice(2, -2)}</strong>
      }
      // Parse inline code: `code`
      const subParts = part.split(/(`.*?`)/g)
      return subParts.map((subPart, j) => {
        if (subPart.startsWith('`') && subPart.endsWith('`')) {
          return <code key={`${i}-${j}`}>{subPart.slice(1, -1)}</code>
        }
        return subPart
      })
    })
  }

  const renderMarkdown = (text) => {
    if (!text) return null

    const lines = text.split('\n')
    const elements = []
    let inList = false
    let listItems = []
    let inPre = false
    let preContent = []

    lines.forEach((line, index) => {
      // Code block start/end
      if (line.trim().startsWith('```')) {
        if (inPre) {
          elements.push(
            <pre key={`pre-${index}`}>
              <code>{preContent.join('\n')}</code>
            </pre>
          )
          preContent = []
          inPre = false
        } else {
          // If list was open, close it first
          if (inList) {
            elements.push(<ul key={`list-${index}`}>{listItems}</ul>)
            listItems = []
            inList = false
          }
          inPre = true
        }
        return
      }

      if (inPre) {
        preContent.push(line)
        return
      }

      // Headers
      const headerMatch = line.match(/^(#{1,6})\s+(.*)$/)
      if (headerMatch) {
        if (inList) {
          elements.push(<ul key={`list-${index}`}>{listItems}</ul>)
          listItems = []
          inList = false
        }
        const level = headerMatch[1].length
        const content = headerMatch[2]
        if (level === 1) elements.push(<h2 key={index}>{parseBoldText(content)}</h2>)
        else if (level === 2) elements.push(<h2 key={index}>{parseBoldText(content)}</h2>)
        else elements.push(<h3 key={index}>{parseBoldText(content)}</h3>)
        return
      }

      // Blockquotes
      if (line.trim().startsWith('>')) {
        if (inList) {
          elements.push(<ul key={`list-${index}`}>{listItems}</ul>)
          listItems = []
          inList = false
        }
        const content = line.trim().substring(1).trim()
        elements.push(<blockquote key={index}>{parseBoldText(content)}</blockquote>)
        return
      }

      // Bullet List Item
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        inList = true
        const content = line.trim().substring(2)
        listItems.push(<li key={`li-${index}`}>{parseBoldText(content)}</li>)
        return
      }

      // Empty line closes list
      if (line.trim() === '') {
        if (inList) {
          elements.push(<ul key={`list-${index}`}>{listItems}</ul>)
          listItems = []
          inList = false
        }
        return
      }

      // Regular paragraph
      if (inList) {
        elements.push(<ul key={`list-${index}`}>{listItems}</ul>)
        listItems = []
        inList = false
      }
      elements.push(<p key={index}>{parseBoldText(line)}</p>)
    })

    // Catch final trailing open lists or pres
    if (inList) {
      elements.push(<ul key='list-final'>{listItems}</ul>)
    }
    if (inPre && preContent.length > 0) {
      elements.push(
        <pre key='pre-final'>
          <code>{preContent.join('\n')}</code>
        </pre>
      )
    }

    return elements
  }

  if (loading) {
    return (
      <GlassCard style={{ minHeight: '300px' }}>
        <LoadingWrapper>
          <RoboIconContainer>
            <svg width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <rect x='3' y='11' width='18' height='10' rx='2' />
              <circle cx='12' cy='5' r='2' />
              <path d='M12 7v4' />
              <line x1='8' y1='16' x2='8.01' y2='16' />
              <line x1='16' y1='16' x2='16.01' y2='16' />
            </svg>
          </RoboIconContainer>
          <LoadingText>{t('aiAnalyzing')}</LoadingText>
          <LoadingBarContainer>
            <LoadingBar />
          </LoadingBarContainer>
        </LoadingWrapper>
      </GlassCard>
    )
  }

  if (analysis) {
    return (
      <GlassCard>
        <ReportHeader>
          <ReportTitle>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
              <polyline points='3.27 6.96 12 12.01 20.73 6.96' />
              <line x1='12' y1='22.08' x2='12' y2='12' />
            </svg>
            {t('aiResultTitle')}
          </ReportTitle>
          <ReAnalyzeButton onClick={handleAnalyze}>
            <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' style={{ marginRight: '6px' }}>
              <path d='M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67' />
            </svg>
            Re-analyze
          </ReAnalyzeButton>
        </ReportHeader>
        <ReportContent>{renderMarkdown(analysis)}</ReportContent>
      </GlassCard>
    )
  }

  return (
    <GlassCard style={{ minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IntroSection>
        <RoboIconContainer>
          <svg width='38' height='38' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
            <rect x='2' y='3' width='20' height='14' rx='2' ry='2' />
            <line x1='8' y1='21' x2='16' y2='21' />
            <line x1='12' y1='17' x2='12' y2='21' />
            <path d='M12 7v4' />
            <line x1='8' y1='9' x2='8' y2='9.01' />
            <line x1='16' y1='9' x2='16' y2='9.01' />
          </svg>
        </RoboIconContainer>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
          {t('aiTab')}
        </h2>
        <p style={{ margin: '0 0 24px 0', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
          Gửi logs và số liệu thống kê của cuộc gọi hiện tại tới mô hình ngôn ngữ lớn Gemma 4 để chẩn đoán, phát hiện lỗi kết nối, chất lượng âm thanh/hình ảnh kém, và nhận hướng xử lý chi tiết.
        </p>
        <AnalyzeButton onClick={handleAnalyze}>
          {t('aiAnalyzeBtn')}
        </AnalyzeButton>
      </IntroSection>
      {error && <ErrorMessage>{t('aiError')} {error}</ErrorMessage>}
    </GlassCard>
  )
}
