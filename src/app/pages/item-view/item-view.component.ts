import { Component, OnInit } from '@angular/core';
import { Item } from '../../domain';
import { ActivatedRoute } from 'testing';
import { DomainService } from '../../domain.service';
import { EditReservationDialogComponent } from 'src/app/components/edit-reservation-dialog/edit-reservation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit {

  isLoading = true;
  item: Item;
  isReserved = false;
  revealStatus = false;
  busy = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DomainService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.service.getItem(id).subscribe({
      next: (result) => {
        if (result.data) {
          this.item = result.data;
        } else {
          this.router.navigate(['/404'], { skipLocationChange: true });
        }
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
        this.isReserved = result.data;
      },
      error: (e) => { },
      complete: () => {
        this.busy = false;
        this.revealStatus = true;
      }
    });
  }

  openDialog() {
    const dlg = this.dialog.open(
      EditReservationDialogComponent,
      {
        data: {
          item: this.item,
          isReserved: this.isReserved,
        }
      });
    dlg.afterClosed().subscribe(() => {
      this.updateAndRevealStatus();
    });
  }
}
