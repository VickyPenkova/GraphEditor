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
import { GraphEditorComponent } from "./graph-editor/graph-editor.component";
import { RouterModule, Routes } from "@angular/router";
import { GraphRendererComponent } from "./graph-renderer/graph-renderer.component";
import {HttpClientModule} from "@angular/common/http";
import { SelectGraphComponent } from './select-graph/select-graph.component';

const routes: Routes = [
  { path: "", component: GraphEditorComponent, pathMatch: 'full'},
  { path: "annotate", component: AnotateTextComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxGraphModule,
    CoreModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    SidebarComponent,
    ColorPickerComponent,
    ItemEditorComponent,
    MenubarComponent,
    AnotateTextComponent,
    GraphEditorComponent,
    GraphRendererComponent,
    SelectGraphComponent
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule {}


