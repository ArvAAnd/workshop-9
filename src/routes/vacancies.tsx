import { createFileRoute } from '@tanstack/react-router';
import { VacanciesListPage } from '../features/vacancies/pages/VacanciesListPage';

export const Route = createFileRoute('/vacancies')({
  component: VacanciesListPage,
});

export default Route;
