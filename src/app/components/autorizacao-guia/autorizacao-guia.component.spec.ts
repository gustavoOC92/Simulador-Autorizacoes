import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizacaoGuiaComponent } from './autorizacao-guia.component';

describe('AutorizacaoGuiaComponent', () => {
  let component: AutorizacaoGuiaComponent;
  let fixture: ComponentFixture<AutorizacaoGuiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutorizacaoGuiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutorizacaoGuiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
