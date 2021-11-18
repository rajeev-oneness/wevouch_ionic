import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./forgotpassword/forgotpassword.module').then( m => m.ForgotpasswordPageModule)
  },
  {
    path: 'extendedwarranty',
    loadChildren: () => import('./extendedwarranty/extendedwarranty.module').then( m => m.ExtendedwarrantyPageModule)
  },
  {
    path: 'amc',
    loadChildren: () => import('./amc/amc.module').then( m => m.AmcPageModule)
  },
  {
    path: 'addticket',
    loadChildren: () => import('./addticket/addticket.module').then( m => m.AddticketPageModule)
  },
  {
    path: 'productdetails',
    loadChildren: () => import('./productdetails/productdetails.module').then( m => m.ProductdetailsPageModule)
  },
  {
    path: 'addaddress',
    loadChildren: () => import('./addaddress/addaddress.module').then( m => m.AddaddressPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
  },
  {
    path: 'editaccount',
    loadChildren: () => import('./editaccount/editaccount.module').then( m => m.EditaccountPageModule)
  },
  {
    path: 'address',
    loadChildren: () => import('./address/address.module').then( m => m.AddressPageModule)
  },
  {
    path: 'ticketdetails',
    loadChildren: () => import('./ticketdetails/ticketdetails.module').then( m => m.TicketdetailsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'package',
    loadChildren: () => import('./package/package.module').then( m => m.PackagePageModule)
  },
  {
    path: 'addproductpage2',
    loadChildren: () => import('./addproductpage2/addproductpage2.module').then( m => m.Addproductpage2PageModule)
  },
  {
    path: 'addproductpage3',
    loadChildren: () => import('./addproductpage3/addproductpage3.module').then( m => m.Addproductpage3PageModule)
  },
  {
    path: 'editproduct',
    loadChildren: () => import('./editproduct/editproduct.module').then( m => m.EditproductPageModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./otp/otp.module').then( m => m.OtpPageModule)
  },
  {
    path: 'thankyou',
    loadChildren: () => import('./thankyou/thankyou.module').then( m => m.ThankyouPageModule)
  },
  {
    path: 'forgotpass',
    loadChildren: () => import('./forgotpass/forgotpass.module').then( m => m.ForgotpassPageModule)
  },
  {
    path: 'forgotpasswithotp',
    loadChildren: () => import('./forgotpasswithotp/forgotpasswithotp.module').then( m => m.ForgotpasswithotpPageModule)
  },
  {
    path: 'zoomproduct',
    loadChildren: () => import('./zoomproduct/zoomproduct.module').then( m => m.ZoomproductPageModule)
  },
  {
    path: 'brand',
    loadChildren: () => import('./brand/brand.module').then( m => m.BrandPageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./category/category.module').then( m => m.CategoryPageModule)
  },
  {
    path: 'subcategory',
    loadChildren: () => import('./subcategory/subcategory.module').then( m => m.SubcategoryPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
