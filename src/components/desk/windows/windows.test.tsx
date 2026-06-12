import { render, screen } from '@testing-library/react'
import { projects } from '../../../data/projects'
import { profile } from '../../../data/profile'
import { ProjectsWindow } from './ProjectsWindow'
import { CvWindow } from './CvWindow'
import { LinksWindow } from './LinksWindow'
import { ContactsWindow } from './ContactsWindow'

test('ProjectsWindow elenca tutti i progetti', () => {
  render(<ProjectsWindow />)
  expect(screen.getByText('App gestionale palestra')).toBeInTheDocument()
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(projects.length)
})

test('CvWindow ha il link di download del PDF', () => {
  render(<CvWindow />)
  const link = screen.getByRole('link', { name: 'Scarica il CV (PDF)' })
  expect(link).toHaveAttribute('href', profile.cvUrl)
  expect(link).toHaveAttribute('download')
})

test('LinksWindow punta a LinkedIn e GitHub', () => {
  render(<LinksWindow />)
  expect(screen.getByRole('link', { name: 'Profilo LinkedIn' })).toHaveAttribute('href', profile.linkedin)
  expect(screen.getByRole('link', { name: 'Profilo GitHub' })).toHaveAttribute('href', profile.github)
})

test('ContactsWindow ha il mailto', () => {
  render(<ContactsWindow />)
  expect(screen.getByRole('link', { name: 'Scrivimi una email' })).toHaveAttribute(
    'href',
    `mailto:${profile.email}`,
  )
})
