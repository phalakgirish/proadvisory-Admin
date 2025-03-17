import { TestBed } from '@angular/core/testing';

import { AllServicesCategoryService } from './all-services-category.service';

describe('AllServicesCategoryService', () => {
  let service: AllServicesCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllServicesCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
