import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizacaoIdentificacaoComponent } from './autorizacao-identificacao.component';

describe('AutorizacaoIdentificacaoComponent', () => {
  let component: AutorizacaoIdentificacaoComponent;
  let fixture: ComponentFixture<AutorizacaoIdentificacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutorizacaoIdentificacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutorizacaoIdentificacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
