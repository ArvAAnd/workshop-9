import { Company } from '../companies/types';

export type Vacancy = {
  id: number;
  title: string;
  description: string | null;
  salary: number | null;
  type: string | null;
  skills?: any;
  experienceYears?: number | null;
  creationDate?: string | null; // use ISO string on frontend
  company: Company | null;
};
