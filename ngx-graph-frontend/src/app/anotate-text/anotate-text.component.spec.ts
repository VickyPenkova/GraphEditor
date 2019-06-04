import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotateTextComponent } from './anotate-text.component';

describe('AnotateTextComponent', () => {
  let component: AnotateTextComponent;
  let fixture: ComponentFixture<AnotateTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnotateTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnotateTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
