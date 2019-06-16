import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-reservation-dialog',
  templateUrl: './edit-reservation-dialog.component.html',
  styleUrls: ['./edit-reservation-dialog.component.css']
})
export class EditReservationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditReservationDialogComponent>
  ) { }

  ngOnInit() {
  }

}
