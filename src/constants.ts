import { options } from 'toastr';

import { MonthsQuarter } from './types';

export const toastrOptions: typeof options = {
  closeButton: true,
  newestOnTop: false,
  progressBar: true,
  preventDuplicates: true,
  showDuration: 300,
  hideDuration: 1000,
  timeOut: 2000,
  extendedTimeOut: 1000,
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
  positionClass: 'toast-bottom-left',
};

export const quarters: MonthsQuarter = {
  Jan: 'Q1',
  Feb: 'Q1',
  Mar: 'Q1',
  Apr: 'Q2',
  May: 'Q2',
  Jun: 'Q2',
  Jul: 'Q3',
  Aug: 'Q3',
  Sep: 'Q3',
  Oct: 'Q4',
  Nov: 'Q4',
  Dec: 'Q4',
};
