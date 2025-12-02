import { createFileRoute } from '@tanstack/react-router';
import VacanciesNewPage from '../features/vacancies/pages/VacanciesNewPage';

// Use a relative child path so this file maps under /vacancies
export const Route = createFileRoute('/vacancies/new')({
  component: VacanciesNewPage,
});

export default Route;
