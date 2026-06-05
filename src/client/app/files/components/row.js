import React from 'react'
import styled from 'styled-components'
import { Urls } from '../../requests'
import { formatDate } from '../../utils'

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`

const ParticipantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Name = styled.span`
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
`

const Times = styled.span`
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  strong {
    color: rgba(255, 255, 255, 0.6);
  }
`

const AppBadge = styled.span`
  background: rgba(124, 58, 237, 0.1);
  color: var(--accent-hover);
  border: 1px solid rgba(124, 58, 237, 0.2);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--panel-border);
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--accent-color);
    border-color: var(--accent-color);
    box-shadow: 0 0 10px var(--accent-glow);
    transform: translateY(-1px);
  }
`

const DownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 245, 212, 0.1);
  border: 1px solid rgba(0, 245, 212, 0.2);
  color: var(--accent-green);
  text-decoration: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--accent-green);
    color: #090a0f;
    transform: translateY(-1px);
  }
`

export default ({ dumpId, userId, startDate, endDate, app }) => {
  return (
    <tr>
      <td>
        <RowContainer>
          <ParticipantInfo>
            <Name>{userId || 'Unknown User'}</Name>
            <Times>
              <span><strong>Joined:</strong> {formatDate(startDate)}</span>
              <span>•</span>
              <span><strong>Left:</strong> {formatDate(endDate)}</span>
            </Times>
          </ParticipantInfo>
          {app && <AppBadge>{app}</AppBadge>}
          <Actions>
            <ActionButton href={Urls.Render(dumpId)} target='_blank'>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              View Stats
            </ActionButton>
            <DownloadButton href={Urls.Download(dumpId)} title="Download Dump File">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </DownloadButton>
          </Actions>
        </RowContainer>
      </td>
    </tr>
  )
}

