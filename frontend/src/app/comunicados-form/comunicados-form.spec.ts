import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicadosForm } from './comunicados-form';

describe('ComunicadosForm', () => {
  let component: ComunicadosForm;
  let fixture: ComponentFixture<ComunicadosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComunicadosForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ComunicadosForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
