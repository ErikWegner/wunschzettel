import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/domain';

export interface EditReservationDialogData {
  item: Item;
}

@Component({
  selector: 'app-edit-reservation-dialog',
  templateUrl: './edit-reservation-dialog.component.html',
  styleUrls: ['./edit-reservation-dialog.component.css']
})
export class EditReservationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditReservationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditReservationDialogData
  ) { }

  ngOnInit() {
  }

}
