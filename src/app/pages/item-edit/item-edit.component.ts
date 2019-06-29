import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from 'testing';
import { DomainService } from '../../domain.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CaptchaState } from 'src/app/components/captcha-state';
import { Item, CaptchaResponse } from 'src/app/domain';

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
  })

  id: number;
  captchaChallengeText = 'Sicherheitsfrage';
  resultText = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: DomainService,
  ) { }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.service.getItem(this.id).subscribe({
      next: (result) => {
        this.itemForm.patchValue(result.data);
        this.hasData = true;
        this.loadCaptcha();
      },
      error: (e) => { },
      complete: () => {
        this.isLoading = false;
      }
    });
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

  loadCaptcha() {
    this.formState = CaptchaState.Loading;
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
  }
}
