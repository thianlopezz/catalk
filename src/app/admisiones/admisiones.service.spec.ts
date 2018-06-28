import { TestBed, inject } from '@angular/core/testing';

import { AdmisionesService } from './admisiones.service';

describe('AdmisionesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdmisionesService]
    });
  });

  it('should be created', inject([AdmisionesService], (service: AdmisionesService) => {
    expect(service).toBeTruthy();
  }));
});
