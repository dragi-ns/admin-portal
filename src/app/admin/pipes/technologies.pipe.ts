import { Pipe, PipeTransform } from '@angular/core';
import { Technology } from '../interfaces/technology';

@Pipe({
  name: 'technologies',
})
export class TechnologiesPipe implements PipeTransform {
  transform(technologies: Technology[]): string {
    return technologies.map((technology) => technology.name).join(', ');
  }
}
