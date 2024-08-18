import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactMeComponent } from './contact-me/contact-me.component';
import { SectionsComponent } from './sections/sections.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import
  {
    faAngleDown, faAngleUp, faAnglesUp, faAngleLeft, faAngleRight,
    faCircleDot, faUpRightFromSquare, faPaperPlane, faEnvelope, faSpinner
  } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

const routes: Routes = [
  {
    path: '', component: SectionsComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'about-me', component: AboutMeComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'contact-me', component: ContactMeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

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
    FontAwesomeModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule
{
  constructor(private library: FaIconLibrary)
  {
    library.addIcons(faAngleDown, faAngleUp, faAnglesUp, faAngleLeft, faAngleRight, faCircleDot,
      faUpRightFromSquare, faPaperPlane, faEnvelope, faLinkedin, faGithub, faSpinner);
  }
}