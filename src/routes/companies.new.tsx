import { createFileRoute } from '@tanstack/react-router';
import { CompaniesNewPage } from '../features/companies/pages/CompaniesNewPage';

export const Route = createFileRoute('/companies/new')({
  component: CompaniesNewPage,
});

export default Route;
