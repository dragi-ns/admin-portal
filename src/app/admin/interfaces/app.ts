import { Technology } from './technology';

export interface App {
  id?: number;
  name: string;
  createdAt: number;
  technologies: Technology[];
}
