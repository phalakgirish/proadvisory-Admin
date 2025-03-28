import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPropertySubtypeComponent } from './add-property-subtype.component';

describe('AddPropertySubtypeComponent', () => {
  let component: AddPropertySubtypeComponent;
  let fixture: ComponentFixture<AddPropertySubtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPropertySubtypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPropertySubtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
