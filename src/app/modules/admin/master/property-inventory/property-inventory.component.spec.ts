import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyInventoryComponent } from './property-inventory.component';

describe('PropertyInventoryComponent', () => {
  let component: PropertyInventoryComponent;
  let fixture: ComponentFixture<PropertyInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
