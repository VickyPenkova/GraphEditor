import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotateTextNewComponent } from './annotate-text-new.component';

describe('AnnotateTextNewComponent', () => {
  let component: AnnotateTextNewComponent;
  let fixture: ComponentFixture<AnnotateTextNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotateTextNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotateTextNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
