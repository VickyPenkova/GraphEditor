import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { AppComponent } from "./app.component";
import { MaterialModule } from "./material.module";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { CoreModule } from "./core/core.module";
import { ColorPickerComponent } from "./sidebar/color-picker/color-picker.component";
import { ItemEditorComponent } from "./sidebar/item-editor/item-editor.component";
import { MenubarComponent } from "./menubar/menubar.component";
import { AnotateTextComponent } from "./anotate-text/anotate-text.component";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxGraphModule,
    CoreModule
  ],
  declarations: [
    AppComponent,
    SidebarComponent,
    ColorPickerComponent,
    ItemEditorComponent,
    MenubarComponent,
    AnotateTextComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
