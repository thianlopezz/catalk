import { TestBed, inject } from '@angular/core/testing';

import { UsuariosServiceService } from './usuarios-service.service';

describe('UsuariosServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsuariosServiceService]
    });
  });

  it('should be created', inject([UsuariosServiceService], (service: UsuariosServiceService) => {
    expect(service).toBeTruthy();
  }));
});
