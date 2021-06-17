import { ChangeDetectorRef, Input, Renderer2, ViewChild } from '@angular/core';
import {
    AfterViewChecked,
    Component,
    EventEmitter,
    OnInit,
    Output
} from '@angular/core';
import { MatDatepicker, MatDatepickerIntl } from '@angular/material/datepicker';
import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE
} from '@angular/material/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

export class CustomDateAdapter extends MomentDateAdapter {
    getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
        return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    }
}

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.`
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { getFullMonthName } from 'src/utils/get-full-month.util';
import { getFullWeekName } from 'src/utils/get-full-week.util';
import { getOrdinalNum } from 'src/utils/get-ordinal-number.util';
import { domainToUnicode } from 'url';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const CUSTOM_FORMAT = {
    parse: {
        dateInput: 'DD/MMMM/YYYY'
    },
    display: {
        dateInput: 'DD MMMM YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
    }
};

@Component({
    selector: 'app-datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.scss'],
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        {
            provide: DateAdapter,
            useClass: CustomDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: CUSTOM_FORMAT }
    ]
})
export class DatepickerComponent implements OnInit {
    @Input() type: 'moment' | 'date' = 'moment';
    @Output() dateSelected = new EventEmitter<Date | _moment.Moment>();
    selectedDate: Date | _moment.Moment;
    clickListener: any;
    hoverListener: any;
    focusListener: any;
    currentView: 'month' | 'year' | 'multi-year' = 'month';

    @ViewChild('picker', { static: false }) picker: MatDatepicker<any>;

    constructor(
        public datePicker: MatDatepickerIntl,
        private cdr: ChangeDetectorRef,
        private renderer: Renderer2,
        private announcer: LiveAnnouncer
    ) {
        //this is fixed here now: https://github.com/angular/components/pull/22763/files
        this.datePicker.prevMultiYearLabel = 'Previous 24 Years';
        this.datePicker.nextMultiYearLabel = 'Next 24 Years';

        this.datePicker.openCalendarLabel = 'Open Datepicker';
        this.datePicker.switchToMonthViewLabel = 'Switch to month view';
        this.datePicker.switchToMultiYearViewLabel = 'Switch to multi year view';
    }

    ngOnInit() { }

    onDateSelection() {
        const output =
            this.type === 'moment'
                ? this.selectedDate
                : new Date(this.selectedDate.toISOString());
        this.dateSelected.emit(output);
        this.announcer.announce(moment(this.selectedDate).format('MMMM, Do YYYY'));
    }

    private setMonthAriaLabel() {
        const monthLabel = document.getElementsByClassName(
            'mat-calendar-body-label'
        )[0];
        if (monthLabel) {
            monthLabel.setAttribute(
                'aria-label',
                `${monthLabel.textContent.trim()}`
            );
        }
    }

    private setDaysAriaLabel() {
        const header = document.getElementsByClassName(
            'mat-calendar-table-header'
        )[0];
        if (header) {
            const days = header.firstElementChild.getElementsByTagName('th');
            for (let i = 0; i < 7; i++) {
                if (days[i]) {
                    days[i].setAttribute('aria-label', getFullWeekName(i));
                    days[i].setAttribute('role', 'columnheader');
                }
            }
        }
    }

    private setDateCellAriaLabel() {
        const allDates: any[] = document.getElementsByClassName(
            'mat-calendar-body-cell'
        ) as any;
        const monthyear = document.getElementsByClassName(
            'mat-calendar-period-button'
        )[0];
        if (monthyear && allDates.length > 0) {
            const firstDateColumn = new Date(
                `${allDates[0].firstElementChild.textContent} ${monthyear.firstElementChild.textContent}`
            ).getDay();
            for (let i = 0; i < allDates.length; i++) {
                const date = `${allDates[i].firstElementChild.textContent} ${monthyear.firstElementChild.textContent}`;
                const column = new Date(date).getDay() + 1;
                const row = Math.ceil(
                    (firstDateColumn +
                        Number(allDates[i].firstElementChild.textContent)) /
                    7
                );
                if (allDates[i].firstElementChild.textContent.length < 3) {
                    const cellAriaLabel = `${getOrdinalNum(
                        allDates[i].firstElementChild.textContent
                    )} of ${monthyear.firstElementChild.textContent
                        }, row ${row} column ${column}`;
                    allDates[i].setAttribute('aria-label', cellAriaLabel);
                }
            }

        }
    }

    opened() {
        setTimeout(() => {
            this.setDateCellAriaLabel();
            this.setDaysAriaLabel();
            const buttons = document
                .querySelectorAll('.mat-calendar-previous-button, .mat-calendar-next-button');
            if (buttons) {
                this.clickListener = Array.from(buttons).map(button => {
                    return this.renderer.listen(button, 'click', () => {
                        if (this.currentView === 'multi-year') {
                            this.addMultiYearLabel();
                        }
                        if (this.currentView === 'month') {
                            this.setDaysAriaLabel();
                            this.setDateCellAriaLabel();
                        }
                    });
                });

                this.hoverListener = Array.from(buttons).map(button => {
                    const hoverListener = this.renderer.listen(button, 'mouseover', () => {
                        this.addTooltip(button);
                    });

                    this.renderer.listen(button, 'mouseout', () => {
                        this.removeTooltip();
                    });
                    return hoverListener;
                });
                this.focusListener = Array.from(buttons).map(button => {
                    const focusListener = this.renderer.listen(button, 'focus', () => {
                        this.addTooltip(button);
                    });

                    this.renderer.listen(button, 'blur', () => {
                        this.removeTooltip();
                    });
                    return focusListener;
                });
            }

            this.addPeriodButtonTooltip();
        });
    }

    closed() {
        this.clickListener.map(l => l());
        this.hoverListener.map(l => l());
        this.focusListener.map(l => l());
    }

    viewChanged(view) {
        this.currentView = view;
        if (view === 'year') {
            this.setMonthAriaLabel();
        }
        if (view === 'month') {
            this.setDaysAriaLabel();
            this.setDateCellAriaLabel();
        }
        if (this.currentView === 'multi-year') {
            this.addMultiYearLabel();
        }
        setTimeout(() => {
            this.announcer.clear();
            this.addPeriodButtonTooltip();
        });
    }

    addTooltip(button, isPeriodButton = false): void {
        this.removeTooltip();
        const div = document.createElement('div');
        div.classList.add('tooltip');
        if (isPeriodButton) {
            div.innerText = button.getAttribute('aria-label');
        } else {
            switch (this.currentView) {
                case 'multi-year': {
                    if (button.classList.contains('mat-calendar-previous-button')) {
                        div.innerText = this.datePicker.prevMultiYearLabel;
                    } else {
                        div.innerText = this.datePicker.nextMultiYearLabel;
                    }
                    break;
                }
                case 'month': {
                    if (button.classList.contains('mat-calendar-previous-button')) {
                        div.innerText = this.datePicker.prevMonthLabel;
                    } else {
                        div.innerText = this.datePicker.nextMonthLabel;
                    }
                    break;
                }
                case 'year': {
                    if (button.classList.contains('mat-calendar-previous-button')) {
                        div.innerText = this.datePicker.prevYearLabel;
                    } else {
                        div.innerText = this.datePicker.nextYearLabel;
                    }
                    break;
                }
            }
        }
        button.appendChild(div);
    }

    removeTooltip(): void {
        document.querySelector('div.tooltip')?.remove();
    }

    addMultiYearLabel() {
        const element = document.getElementsByClassName('mat-calendar-period-button')[0];
        if (element) {
            const self = this;
            setTimeout(() => {
                const text = (element as any).innerText.toString();
                self.announcer.announce(`Showing ${text.replace('–', 'to')}`);
            });
        }
    }

    addPeriodButtonTooltip() {
        const periodButton = document.querySelector('.mat-calendar-period-button');
            if (periodButton) {
                const hoverListener = this.renderer.listen(periodButton, 'mouseover', () => {
                    this.addTooltip(periodButton, true);
                });

                this.renderer.listen(periodButton, 'mouseout', () => {
                    this.removeTooltip();
                });
                this.hoverListener = [...this.hoverListener, hoverListener];

                const focusListener = this.renderer.listen(periodButton, 'focus', () => {
                    this.addTooltip(periodButton, true);
                });

                this.renderer.listen(periodButton, 'blur', () => {
                    this.removeTooltip();
                });
                this.focusListener = [...this.focusListener, focusListener];
            }
    }
}
