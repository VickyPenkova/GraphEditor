import { TestBed } from '@angular/core/testing';

import { AnnotateTextService } from './annotate-text.service';

describe('AnnotateTextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnnotateTextService = TestBed.get(AnnotateTextService);
    expect(service).toBeTruthy();
  });
});
