import { Routes } from '@angular/router';
import { AutorizacaoIdentificacaoComponent } from './components/autorizacao-identificacao/autorizacao-identificacao.component';
import { AutorizacaoGuiaComponent } from './components/autorizacao-guia/autorizacao-guia.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'autorizacao-identificacao',
        pathMatch: 'full'
    },
    {
        path: 'autorizacao-identificacao',
        component: AutorizacaoIdentificacaoComponent
    },
    {
        path: 'autorizacao-guia',
        component: AutorizacaoGuiaComponent
    },
];
