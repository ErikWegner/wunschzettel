interface IDialogInterface {
  showModal(): void
  close(): void
}
interface IDialogPolyfill {
  registerDialog(dialog: IDialogInterface): void
}
declare var dialogPolyfill: IDialogPolyfill
