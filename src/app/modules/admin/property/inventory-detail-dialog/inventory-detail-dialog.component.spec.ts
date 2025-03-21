import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDetailDialogComponent } from './inventory-detail-dialog.component';

describe('InventoryDetailDialogComponent', () => {
  let component: InventoryDetailDialogComponent;
  let fixture: ComponentFixture<InventoryDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
