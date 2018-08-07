import { TestBed, inject } from '@angular/core/testing';

import { TramitesService } from './tramites.service';

describe('TramitesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TramitesService]
    });
  });

  it('should be created', inject([TramitesService], (service: TramitesService) => {
    expect(service).toBeTruthy();
  }));
});
