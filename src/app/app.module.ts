import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { SectionsComponent } from './sections/sections.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faAngleUp, faAnglesUp } from '@fortawesome/free-solid-svg-icons';

const routes: Routes = [
  {
    path: '', component: SectionsComponent, children: [
      { path: '', redirectTo: 'all', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'about-me', component: AboutMeComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'contact-me', component: ContactMeComponent },

      //{ path: ':side', component: ListComponent }
    ]
  },
  //{ path: '', redirectTo: '/home', pathMatch: 'full' },
  //{ path: 'home', component: HomeComponent },
  // { path: 'about', component: AboutComponent },
  // { path: 'services', component: ServicesComponent }

  // {
  //   path: 'characters', component: TabsComponent, children: [
  //     { path: '', redirectTo: 'all', pathMatch: 'full' },
  //     { path: ':side', component: ListComponent }
  //   ]
  // },
  // { path: 'new-character', loadChildren: () => import('./create-character/create-character.module').then(m => m.CreateCharacterModule) }, //Lazy loading, załaduje się dopiero po kliknięciu w tego link
  // { path: '**', redirectTo: '/characters' }//Musi być OSTATNIE żeby złapać wszytskie POZOSTAŁE adresy
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutMeComponent,
    ProjectsComponent,
    ContactMeComponent,
    SectionsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes, { anchorScrolling: 'enabled' }),
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule
{
  constructor(private library: FaIconLibrary)
  {
    library.addIcons(faAngleDown, faAngleUp, faAnglesUp);
  }
}
