import { createFileRoute } from '@tanstack/react-router';
import { CompanyEditPage } from '../features/companies/pages/CompanyEditPage';

export const Route = createFileRoute('/companies/$companyId')({
  component: CompanyEditPage,
});

export default Route;
