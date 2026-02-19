import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizacaoResultadoComponent } from './autorizacao-resultado.component';

describe('AutorizacaoResultadoComponent', () => {
  let component: AutorizacaoResultadoComponent;
  let fixture: ComponentFixture<AutorizacaoResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutorizacaoResultadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutorizacaoResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
