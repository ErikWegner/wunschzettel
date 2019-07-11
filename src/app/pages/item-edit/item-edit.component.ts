import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from 'testing';
import { DomainService } from '../../domain.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CaptchaState } from 'src/app/components/captcha-state';
import { Item, CaptchaResponse } from 'src/app/domain';
import { Router } from '@angular/router';

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

  itemForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    category: ['', Validators.required],
    imagesrc: [''],
    buyurl: [''],
    captchaResponse: ['', Validators.required],
  });

  id: number;
  captchaChallengeText = 'Sicherheitsfrage';
  captchaChallengeHint = 'Hinweis';
  resultText = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: DomainService,
  ) { }

  ngOnInit() {
    const routingId = this.route.snapshot.paramMap.get('id');
    if (routingId) {
      // Edit an existing item
      this.id = parseInt(routingId, 10);
      this.service.getItem(this.id).subscribe({
        next: (result) => {
          if (result.data) {
            this.itemForm.patchValue(result.data);
            this.hasData = true;
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
    } else {
      // Add a new item
      this.id = 0;
      this.hasData = true;
      this.isLoading = false;
      this.loadCaptcha();
    }
  }

  submitClick() {
    this.formState = CaptchaState.Submitting;
    const item = new Item();
    item.id = this.id;
    const formValue = this.itemForm.value;
    item.title = formValue.title;
    item.category = formValue.category;
    item.imagesrc = formValue.imagesrc;
    item.buyurl = formValue.buyurl;
    item.description = formValue.description;
    if (this.id === 0) {
      // Add new item
      this.service.addItem(item, new CaptchaResponse(formValue.captchaResponse)).subscribe({
        next: (result) => {
          this.formState = result.success ? CaptchaState.Success : CaptchaState.Error;
          this.resultText = result.data.message;
          if (result.success && result.data.id > 0) {
            this.router.navigate(['/items', result.data.id]);
          }
        },
        error: (e) => {
          this.formState = CaptchaState.Fail;
          this.resultText = 'Übertragungsfehler';
        }
      });
    } else {
      // Update existing item
      this.service.setItem(item, new CaptchaResponse(formValue.captchaResponse)).subscribe({
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

  loadCaptcha() {
    this.formState = CaptchaState.Loading;
    this.service.getCaptchaChallenge().subscribe({
      next: (result) => {
        this.captchaChallengeText = result.data.text;
        this.captchaChallengeHint = result.data.hint;
      },
      error: (e) => {
        this.formState = CaptchaState.Fail;
      },
      complete: () => {
        this.formState = CaptchaState.WaitingForUserInput;
      }
    });
  }
}
