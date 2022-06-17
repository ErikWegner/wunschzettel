import { provideMockStore } from '@ngrx/store/testing';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ErrorDisplayComponent } from 'src/app/components/error-display/error-display.component';
import { AppStateBuilder } from 'testing/app.state.builder';
import { moduleImports } from './matmetadata';

export default {
  title: 'Error display',
  component: ErrorDisplayComponent,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: moduleImports,
      providers: [
        provideMockStore({
          initialState: AppStateBuilder.withBookCategoryAndItems(),
        }),
      ],
    }),
  ],
} as Meta;

const Template: Story<ErrorDisplayComponent> = (
  args: ErrorDisplayComponent
) => ({
  props: args,
});

export const Empty: Story = () => ({});

export const ErrorText: Story = () => ({});
ErrorText.decorators = [
  moduleMetadata({
    declarations: [],
    imports: moduleImports,
    providers: [
      provideMockStore({
        initialState: AppStateBuilder.hasError('The request failed'),
      }),
    ],
  }),
];
