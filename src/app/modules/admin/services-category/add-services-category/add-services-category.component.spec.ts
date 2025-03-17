import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServicesCategoryComponent } from './add-services-category.component';

describe('AddServicesCategoryComponent', () => {
  let component: AddServicesCategoryComponent;
  let fixture: ComponentFixture<AddServicesCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddServicesCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServicesCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
