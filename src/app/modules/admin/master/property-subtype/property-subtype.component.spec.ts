import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySubtypeComponent } from './property-subtype.component';

describe('PropertySubtypeComponent', () => {
  let component: PropertySubtypeComponent;
  let fixture: ComponentFixture<PropertySubtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertySubtypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertySubtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
