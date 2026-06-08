import React from 'react'
import styled from 'styled-components'

import { formatDate } from '../../utils'
import Row from './row'
import SortOptions from './sort-options'
import { Urls } from '../../requests'
import { useTranslation } from '../../locales'

const Content = styled.div`
  padding: 24px;
  background: rgba(0, 0, 0, 0.12);
  border-top: 1px solid var(--panel-border);
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  margin: 0;

  td, th {
    border: none;
    border-bottom: 1px solid var(--panel-border);
    padding: 12px 18px;
  }

  th {
    background-color: rgba(255, 255, 255, 0.03);
    color: var(--text-primary);
    font-family: var(--font-heading);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
  }

  tr:last-child td {
    border-bottom: none;
  }
`

const Details = styled.details`
  background: var(--panel-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--panel-border);
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &[open] {
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }
`

const SummaryContainer = styled.summary`
  cursor: pointer;
  padding: 22px 24px;
  list-style: none;
  position: relative;
  outline: none;
  transition: background 0.3s ease;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  &::after {
    content: '▼';
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.8rem;
    color: var(--text-secondary);
    transition: transform 0.3s ease;
  }

  details[open] &::after {
    transform: translateY(-50%) rotate(180deg);
    color: var(--accent-green);
  }
`

const SummaryDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
  padding-right: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
`

const Emph = styled.span`
  font-family: var(--font-heading);
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const PermalinkLink = styled.a`
  color: var(--accent-blue);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;

  &:hover {
    color: var(--accent-green);
    text-decoration: underline;
  }
`

const NonGroup = styled.div`
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
`

const TableAndSort = styled.div`
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 24px;
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`

export default ({ id, data }) => {
  const { t } = useTranslation()
  const { group, startDate, endDate, participants } = data
  const isNonGrouped = id === 'other'
  const permalink = Urls.Permalink(group[0]?.sessionId)
  const conferenceId = group[0]?.conferenceId || group[0]?.conferenceUrl

  return (
    <Details>
      <SummaryContainer>
        <SummaryDetails>
          {isNonGrouped
            ? <NonGroup><Emph>{t('other')} </Emph>{`${group.length} ${t('participantsCount')}`}</NonGroup>
            : (
              <>
                <MetaItem><Emph>{t('permalink')}</Emph> <PermalinkLink href={permalink} target="_blank">{permalink}</PermalinkLink></MetaItem>
                {conferenceId && <MetaItem><Emph>{t('conferenceId')}</Emph> {conferenceId}</MetaItem>}
                <MetaItem>
                  <Emph>{t('startTime')}</Emph> {formatDate(startDate)}
                  <span style={{ margin: '0 8px', color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
                  <Emph>{t('endTime')}</Emph> {formatDate(endDate)}
                </MetaItem>
                <MetaItem><Emph>{t('participants')}</Emph> {participants}</MetaItem>
              </>
              )}
        </SummaryDetails>
      </SummaryContainer>
      <Content>
        <TableAndSort>
          <Table>
            <thead>
              <tr>
                <th>{t('fileParticipantDetails')}</th>
              </tr>
            </thead>
            <tbody>
              {group.map(entry => <Row key={entry.dumpId} {...entry} />)}
            </tbody>
          </Table>
          <SortOptions id={id} />
        </TableAndSort>
      </Content>
    </Details>
  )
}

