import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { App } from '../../interfaces/app';
import { Technology } from '../../interfaces/technology';
import { AppsService } from '../../services/apps.service';

@Component({
  selector: 'app-app-dialog',
  templateUrl: './app-dialog.component.html',
  styleUrls: ['./app-dialog.component.scss'],
})
export class AppDialogComponent implements OnInit {
  @Output() submitted = new EventEmitter<App>();

  loading = false;
  // Fixme: This array is fetched every time the user opens dialog
  technologiesSelect: Technology[] = [];
  appForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(32)]],
    createdAt: ['', [Validators.required]],
    technologies: this.fb.array([]),
  });

  constructor(
    private fb: FormBuilder,
    private appsService: AppsService,
    @Inject(MAT_DIALOG_DATA) public data?: App
  ) {
    if (!data) {
      this.addTechnology(undefined, false);
    } else {
      this.appForm.patchValue({
        ...data,
        createdAt: new Date(data.createdAt),
      });
      for (const technology of data.technologies) {
        this.addTechnology(technology, false);
      }
    }
  }

  ngOnInit() {
    this.appsService.getTechnologies().subscribe((technologies) => {
      this.technologiesSelect = technologies;
    });
  }

  get name() {
    return this.appForm.get('name');
  }

  get createdAt() {
    return this.appForm.get('createdAt');
  }

  get technologies() {
    return this.appForm.get('technologies') as FormArray;
  }

  compareWith(app1: App, app2: App): boolean {
    return app1 && app2 ? app1.id === app2.id : app1 === app2;
  }

  techAlreadySelected(tech: Technology): boolean {
    for (const selectedTech of this.technologies.controls) {
      if (selectedTech.value.id === tech.id) {
        return true;
      }
    }
    return false;
  }

  addTechnology(technology?: Technology, markAsDirty: boolean = true) {
    this.technologies.push(this.createTechnologyControl(technology));
    if (markAsDirty) {
      this.technologies.markAsDirty();
    }
  }

  removeTechnology(index: number, markAsDirty: boolean = true) {
    this.technologies.removeAt(index);
    if (markAsDirty) {
      this.technologies.markAsDirty();
    }
  }

  onSubmit() {
    const data = this.appForm.getRawValue();
    this.submitted.emit({ ...data, createdAt: data.createdAt.getTime() });
  }

  private createTechnologyControl(value?: Technology) {
    return this.fb.control(value ?? '', Validators.required);
  }
}
