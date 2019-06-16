import { Component, OnInit } from '@angular/core';
import { Item } from '../../domain';
import { ActivatedRoute } from 'testing';
import { DomainService } from '../../domain.service';
import { EditReservationDialogComponent } from 'src/app/components/edit-reservation-dialog/edit-reservation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit {

  isLoading = true;
  item: Item;
  revealStatus = false;
  busy = false;

  constructor(
    private route: ActivatedRoute,
    private service: DomainService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.service.getItem(id).subscribe({
      next: (result) => {
        this.item = result.data;
      },
      error: (e) => { },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  updateAndRevealStatus() {
    this.busy = true;
    this.service.getReservationFlag(this.item.id).subscribe({
      next: (result) => {
        this.item.isReserved = result.data;
      },
      error: (e) => { },
      complete: () => {
        this.busy = false;
        this.revealStatus = true;
      }
    });
  }

  openDialog() {
    this.dialog.open(
      EditReservationDialogComponent,
      {
        data: {
          item: this.item
        }
      });
  }
}
