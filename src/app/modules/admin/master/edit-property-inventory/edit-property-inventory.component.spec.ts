import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPropertyInventoryComponent } from './edit-property-inventory.component';

describe('EditPropertyInventoryComponent', () => {
  let component: EditPropertyInventoryComponent;
  let fixture: ComponentFixture<EditPropertyInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPropertyInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPropertyInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
