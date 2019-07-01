import { NgModule } from '@angular/core';

import { RouterLinkDirectiveStub } from '../../testing/router-link-directive-stub';
import { TestAppLoaderComponent } from '../../testing/apploader';

@NgModule({
    declarations: [
        RouterLinkDirectiveStub,
        TestAppLoaderComponent,
    ], exports: [
        RouterLinkDirectiveStub,
        TestAppLoaderComponent,
    ]
})
export class TestingModule { }
