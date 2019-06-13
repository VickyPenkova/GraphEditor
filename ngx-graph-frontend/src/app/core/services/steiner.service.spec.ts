import { TestBed } from '@angular/core/testing';

import { SteinerService } from './steiner.service';

describe('SteinerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SteinerService = TestBed.get(SteinerService);
    expect(service).toBeTruthy();
  });
});
