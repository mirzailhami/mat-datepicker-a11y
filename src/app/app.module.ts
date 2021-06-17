import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
    MatDatepickerModule
} from "@angular/material/datepicker";
import {
    MatInputModule,
} from '@angular/material/input';
import { FormsModule } from "@angular/forms";
import { A11yModule } from '@angular/cdk/a11y';
import { DatepickerComponent } from "./components/datepicker/datepicker.component";

@NgModule({
    declarations: [AppComponent, DatepickerComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatDatepickerModule,
        FormsModule,
        A11yModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
