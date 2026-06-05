import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'

import { sortGroup } from '../actions'
import { SORT_TYPES } from '../reducer'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--panel-border);
  border-radius: 12px;
  padding: 16px;
  width: 100%;
`

const Label = styled.div`
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const Options = styled.select`
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  border: 1px solid var(--panel-border);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 10px var(--accent-glow);
  }

  option {
    background-color: #151a22;
    color: var(--text-primary);
  }
`

export default ({ id }) => {
  const dispatch = useDispatch()
  const onChange = ({ target: { value } }) => {
    dispatch(sortGroup(id, value))
  }

  return (
    <Container>
      <Label>Sort by</Label>
      <Options name='sort' onChange={onChange}>
        <option value={SORT_TYPES.none}>None</option>
        <option value={SORT_TYPES.userAscending}>Name A-Z</option>
        <option value={SORT_TYPES.userDescending}>Name Z-A</option>
        <option value={SORT_TYPES.joinAscending}>Join - Ascending</option>
        <option value={SORT_TYPES.joinDescending}>Join - Descending</option>
        <option value={SORT_TYPES.leaveAscending}>Leave - Ascending</option>
        <option value={SORT_TYPES.leaveDescending}>Leave - Descending</option>
      </Options>
    </Container>
  )
}

