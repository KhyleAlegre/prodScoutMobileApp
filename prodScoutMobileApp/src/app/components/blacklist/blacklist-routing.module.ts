import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlacklistPage } from './blacklist.page';

const routes: Routes = [
  {
    path: '',
    component: BlacklistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlacklistPageRoutingModule {}
