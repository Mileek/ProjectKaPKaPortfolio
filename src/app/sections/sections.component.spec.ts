import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionsComponent } from './SectionsComponent';

describe('SectionsComponent', () =>
{
  let component: SectionsComponent;
  let fixture: ComponentFixture<SectionsComponent>;

  beforeEach(async () =>
  {
    await TestBed.configureTestingModule({
      declarations: [SectionsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () =>
  {
    expect(component).toBeTruthy();
  });
});
