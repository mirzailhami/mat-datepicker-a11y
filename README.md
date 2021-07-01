# Datepicker

Angular Material datepicker a11y customization.

## Requirement

- Node.js v10.15.0

- Angular v11

## Installation

Run `npm install` to install all dependencies.

## Use Datepicker component

import the Datepicker Component to the module

```
import { DatepickerComponent } from './components/datepicker/datepicker.component';
```

To use the Datepicker Component

```
<app-datepicker [type]="'moment'" (dateSelected)="yourMethod($event)"></app-datepicker>
```

```
@Input(): type: 'moment' | 'date' - to configure the output type of the selected date. default is 'moment'

@Output(): dateSelected($event) -  method to get the selected date
```

---

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running ESLint

Run `ng lint` to execute ESLint.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
