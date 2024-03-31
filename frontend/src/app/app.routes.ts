import {Routes} from '@angular/router';
import {IndexComponent} from './components/index/index.component';
import {AuthComponent} from "./components/auth/auth.component";

export const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'auth', component: AuthComponent},
];
