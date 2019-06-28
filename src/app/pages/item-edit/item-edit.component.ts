import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from 'testing';
import { DomainService } from '../../domain.service';
import { FormControl } from '@angular/forms';
import { CaptchaState } from 'src/app/components/captcha-state';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit {
  formStateEnum = CaptchaState;
  formState = CaptchaState.Loading;

  isLoading = true;
  hasData = false;

  title = new FormControl('');
  description = new FormControl('');
  category = new FormControl('');
  imagesrc = new FormControl('');
  buyurl = new FormControl('');
  captchaResponse = new FormControl('');

  captchaChallengeText = 'Sicherheitsfrage';

  constructor(
    private route: ActivatedRoute,
    private service: DomainService,
  ) { }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.service.getItem(id).subscribe({
      next: (result) => {
        this.title.setValue(result.data.title);
        this.description.setValue(result.data.description);
        this.category.setValue(result.data.category);
        this.imagesrc.setValue(result.data.imagesrc);
        this.buyurl.setValue(result.data.buyurl);
        this.hasData = true;
        this.service.getCaptchaChallenge().subscribe({
          next: (result) => {
            this.captchaChallengeText = result.data.text;
          },
          error: (e) => {
            this.formState = CaptchaState.Fail;
          },
          complete: () => {
            this.formState = CaptchaState.WaitingForUserInput;
          } 
        });
      },
      error: (e) => { },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

}
