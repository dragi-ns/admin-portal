import { Technology } from './technology';

export interface App {
  id?: number;
  name: string;
  createdAt: Date;
  technologies: Technology[];
}
