import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlacklistPageRoutingModule } from './blacklist-routing.module';

import { BlacklistPage } from './blacklist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlacklistPageRoutingModule
  ],
  declarations: [BlacklistPage]
})
export class BlacklistPageModule {}
