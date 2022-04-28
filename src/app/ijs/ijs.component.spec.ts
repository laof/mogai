import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IjsComponent } from './ijs.component';

describe('IjsComponent', () => {
  let component: IjsComponent;
  let fixture: ComponentFixture<IjsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IjsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
