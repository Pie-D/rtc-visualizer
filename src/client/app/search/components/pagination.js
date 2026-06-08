import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { search } from '../actions'
import { getSearchPage, getSearchLimit, getSearchTotal, getRawSearchParams } from '../selectors'
import { useTranslation } from '../../locales'

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 30px;
  margin-bottom: 20px;
`

const NavButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--panel-border);
  color: var(--text-primary);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--accent-color);
    box-shadow: 0 0 10px var(--accent-glow);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const PageIndicator = styled.span`
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 500;
`

export default () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const page = useSelector(getSearchPage)
  const limit = useSelector(getSearchLimit)
  const total = useSelector(getSearchTotal)
  const rawParams = useSelector(getRawSearchParams)

  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) {
    return null
  }

  const handlePageChange = (targetPage) => {
    dispatch(search({
      ...rawParams,
      page: targetPage
    }))
  }

  return (
    <PaginationContainer>
      <NavButton
        disabled={page <= 1}
        onClick={() => handlePageChange(page - 1)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        {t('prevPage')}
      </NavButton>
      <PageIndicator>
        {t('pageOf', { page, pages: totalPages })}
      </PageIndicator>
      <NavButton
        disabled={page >= totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        {t('nextPage')}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </NavButton>
    </PaginationContainer>
  )
}
