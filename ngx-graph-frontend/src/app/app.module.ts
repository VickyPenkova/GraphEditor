import { NgModule } from '@angular/core';
import { BrowserModule,  } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CoreModule } from './core/core.module';

@NgModule({
  imports:      
  [ 
    BrowserModule, 
    BrowserAnimationsModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MaterialModule,
    NgxGraphModule,
    CoreModule 
  ],
  declarations: [ AppComponent, SidebarComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
