import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoannotateComponent } from './autoannotate.component';

describe('AutoannotateComponent', () => {
  let component: AutoannotateComponent;
  let fixture: ComponentFixture<AutoannotateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoannotateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoannotateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
