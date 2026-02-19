import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirProcedimentosComponent } from './inserir-procedimentos.component';

describe('InserirProcedimentosComponent', () => {
  let component: InserirProcedimentosComponent;
  let fixture: ComponentFixture<InserirProcedimentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InserirProcedimentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InserirProcedimentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
