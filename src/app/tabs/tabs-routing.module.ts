import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'products',
        loadChildren: () => import('../products/products.module').then( m => m.ProductsPageModule)
      },
      {
        path: 'addproduct',
        loadChildren: () => import('../addproduct/addproduct.module').then( m => m.AddproductPageModule)
      },
      {
        path: 'ticket',
        loadChildren: () => import('../ticket/ticket.module').then( m => m.TicketPageModule)
      },
      {
        path: 'support',
        loadChildren: () => import('../support/support.module').then( m => m.SupportPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
