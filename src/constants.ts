import { options } from 'toastr';

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
