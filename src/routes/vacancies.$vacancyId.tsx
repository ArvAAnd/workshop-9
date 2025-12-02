import { createFileRoute } from '@tanstack/react-router';
import VacancyEditPage from '../features/vacancies/pages/VacancyEditPage';

export const Route = createFileRoute('/vacancies/$vacancyId')({
  component: VacancyEditPage,
});

export default Route;
