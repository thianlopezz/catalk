import { TestBed, inject } from '@angular/core/testing';

import { EstadisticasService } from './estadisticas.service';

describe('EstadisticasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstadisticasService]
    });
  });

  it('should be created', inject([EstadisticasService], (service: EstadisticasService) => {
    expect(service).toBeTruthy();
  }));
});
