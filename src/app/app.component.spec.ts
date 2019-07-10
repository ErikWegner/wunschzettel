import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { RouterLinkDirectiveStub } from 'testing';
import { By } from '@angular/platform-browser';
import { TestingModule } from './testing.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CustomMaterialModule,
        TestingModule,
      ],
      declarations: [
        AppComponent,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Wunschzettel'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Wunschzettel');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('mat-toolbar > span').textContent).toContain('Wunschzettel');
  });

  it('should have a link to start page', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const linkDes = fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub));
    const routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
    expect(routerLinks.length).toBe(1);
    expect(routerLinks.map(r => r.linkParams)).toEqual(['/']);
  });
});
