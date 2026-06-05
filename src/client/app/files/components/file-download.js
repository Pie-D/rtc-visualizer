import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { showAndFetchFile } from '../actions'

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
  display: flex;
  gap: 20px;
  align-items: flex-end;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`

const Label = styled.label`
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
`

const Input = styled.input`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--panel-border);
  color: var(--text-primary);
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;

  &:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--accent-color);
    box-shadow: 0 0 12px var(--accent-glow);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }
`

const Button = styled.button`
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

export default () => {
  const dispatch = useDispatch()
  const handleSubmit = e => {
    const { target: { elements: { file } } } = e

    e.preventDefault()
    dispatch(showAndFetchFile(file.value.trim()))
  }

  return (
    <Frame>
      <Legend>Find file</Legend>
      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor='file'>File name *</Label>
          <Input
            type='text'
            autoComplete='on'
            name='file'
            placeholder='xxx-yyy.gz'
            required
          />
        </Field>
        <Button type='submit'>Download</Button>
      </Form>
    </Frame>
  )
}

