import { createFileRoute } from '@tanstack/react-router'
import CompaniesListPage from '../features/companies/pages/CompaniesListPage'

export const Route = createFileRoute('/companies')({
  component: CompaniesListPage,
})

// function RouteComponent() {
//   return <div>Hello "/companies"!</div>
// }
