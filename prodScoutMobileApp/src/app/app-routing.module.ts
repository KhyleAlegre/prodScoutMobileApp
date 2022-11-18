import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },  {
    path: 'myprofile',
    loadChildren: () => import('./components/myprofile/myprofile.module').then( m => m.MyprofilePageModule)
  },
  {
    path: 'profiles',
    loadChildren: () => import('./components/profiles/profiles.module').then( m => m.ProfilesPageModule)
  },
  {
    path: 'blacklist',
    loadChildren: () => import('./components/blacklist/blacklist.module').then( m => m.BlacklistPageModule)
  },
  {
    path: 'watchlist',
    loadChildren: () => import('./components/watchlist/watchlist.module').then( m => m.WatchlistPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
