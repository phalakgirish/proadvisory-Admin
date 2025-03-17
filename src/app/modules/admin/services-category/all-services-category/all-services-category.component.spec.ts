import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllServicesCategoryComponent } from './all-services-category.component';

describe('AllServicesCategoryComponent', () => {
  let component: AllServicesCategoryComponent;
  let fixture: ComponentFixture<AllServicesCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllServicesCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllServicesCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
