import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { getSearchError } from '../selectors'
import Error from '../../errors/components'
import { search } from '../actions'
import SearchDetails from './search-details'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useTranslation } from '../../locales'

const Frame = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
`

const Legend = styled.legend`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--text-primary);
`

const Form = styled.form`
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.2fr 120px;
  gap: 20px;
  align-items: flex-end;

  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`

const SearchField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SearchLabel = styled.label`
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
`

const SearchInput = styled.input`
  background: var(--input-bg);
  border: 1px solid var(--panel-border);
  color: var(--text-primary);
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;

  &:focus {
    background: var(--input-bg-focus);
    border-color: var(--accent-color);
    box-shadow: 0 0 12px var(--accent-glow);
  }

  &::placeholder {
    color: var(--input-placeholder);
  }
`

const DatePickerContainer = styled.div`
  width: 100%;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    background: var(--input-bg);
    border: 1px solid var(--panel-border);
    color: var(--text-primary);
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 0.95rem;
    outline: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;

    &:focus {
      background: var(--input-bg-focus);
      border-color: var(--accent-color);
      box-shadow: 0 0 12px var(--accent-glow);
    }
  }

  .react-datepicker-popper {
    z-index: 9999;
  }
`

const SearchButton = styled.button`
  background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-hover) 100%);
  color: #ffffff;
  border: none;
  padding: 13px 24px;
  border-radius: 10px;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px var(--accent-glow);
  width: 100%;
  height: 47px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(138, 43, 226, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`

function getMaxDatePlaceholder () {
  return new Date()
}

function getMinDatePlaceholder () {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return date
}

export default () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const error = useSelector(getSearchError)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('sessionId') || params.get('meetingUniqueId')
    if (sessionId) {
      dispatch(search({
        sessionId: sessionId
      }))
    }
  }, [dispatch])

  const [startDate, setStartDate] = useState(getMinDatePlaceholder())
  const [endDate, setEndDate] = useState(getMaxDatePlaceholder())

  const handleSubmit = e => {
    const { target: { elements: { conferenceId } } } = e

    e.preventDefault()
    dispatch(search({
      conferenceId: conferenceId.value.trim(),
      minDate: startDate.toISOString().substring(0, 10),
      maxDate: endDate.toISOString().substring(0, 10)
    }))
  }

  return (
    <div>
      <Frame>
        <Legend>{t('searchBy')}</Legend>
        <Form onSubmit={handleSubmit}>
          <SearchField>
            <SearchLabel htmlFor='conferenceId'>{t('conferenceLabel')}</SearchLabel>
            <SearchInput
              type='text'
              autoComplete='on'
              name='conferenceId'
              placeholder={t('conferencePlaceholder')}
              autoFocus
            />
          </SearchField>
          <SearchField>
            <SearchLabel htmlFor='minDate'>{t('minDate')}</SearchLabel>
            <DatePickerContainer>
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            </DatePickerContainer>
          </SearchField>
          <SearchField>
            <SearchLabel htmlFor='maxDate'>{t('maxDate')}</SearchLabel>
            <DatePickerContainer>
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            </DatePickerContainer>
          </SearchField>
          <SearchField>
            <SearchButton type='submit'>{t('search')}</SearchButton>
          </SearchField>
        </Form>
      </Frame>
      <div>
        <SearchDetails />
        {error && <Error {...error} />}
      </div>
    </div>
  )
}
