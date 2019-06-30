import { Component, OnInit } from '@angular/core';
import { Item, CaptchaResponse } from '../../domain';
import { ActivatedRoute } from 'testing';
import { DomainService } from '../../domain.service';
import { CaptchaState } from 'src/app/components/captcha-state';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-delete',
  templateUrl: './item-delete.component.html',
  styleUrls: ['./item-delete.component.css']
})
export class ItemDeleteComponent implements OnInit {
  formStateEnum = CaptchaState;
  formState = CaptchaState.Loading;

  captchaResponse = new FormControl({ disabled: true, value: '' }, [
    Validators.required
  ]);

  isLoading = true;
  item: Item;
  captchaChallengeText = 'Sicherheitsfrage';
  resultText = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: DomainService,
  ) { }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.service.getItem(id).subscribe({
      next: (result) => {
        if (result.data) {
          this.item = result.data;
          this.loadCaptcha();
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

  loadCaptcha() {
    this.formState = CaptchaState.Loading;
    this.captchaResponse.disable();
    this.service.getCaptchaChallenge().subscribe({
      next: (result) => {
        this.captchaChallengeText = result.data.text;
        this.captchaResponse.enable();
        this.captchaResponse.reset();
      },
      error: (e) => {
        this.formState = CaptchaState.Fail;
      },
      complete: () => {
        this.formState = CaptchaState.WaitingForUserInput;
      }
    });
  }

  submitClick() {
    this.formState = CaptchaState.Submitting;
    this.captchaResponse.disable();
    this.service.deteleItem(
      this.item.id,
      new CaptchaResponse(this.captchaResponse.value)).subscribe({
        next: (result) => {
          this.formState = result.success ? CaptchaState.Success : CaptchaState.Error;
          this.resultText = result.data;
        },
        error: (e) => {
          this.formState = CaptchaState.Fail;
          this.resultText = 'Übertragungsfehler';
        }
      });
  }
}
