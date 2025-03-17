import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPropertySubtypeComponent } from './edit-property-subtype.component';

describe('EditPropertySubtypeComponent', () => {
  let component: EditPropertySubtypeComponent;
  let fixture: ComponentFixture<EditPropertySubtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPropertySubtypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPropertySubtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
