import { TestBed } from '@angular/core/testing';

import { ItemEditService } from './item-edit.service';

describe('ItemEditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ItemEditService = TestBed.get(ItemEditService);
    expect(service).toBeTruthy();
  });
});
