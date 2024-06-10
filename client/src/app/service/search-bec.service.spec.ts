import { TestBed } from '@angular/core/testing';

import { SearchBecService } from './search-bec.service';

describe('SearchBecService', () => {
  let service: SearchBecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchBecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
