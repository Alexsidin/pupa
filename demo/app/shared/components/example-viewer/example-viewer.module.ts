import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { PropsRadioSelectComponent } from './components/props-radio-select/props-radio-select.component';
import { CommonModule } from '@angular/common';
import { ExampleViewerContentComponent } from './components/example-viewer-content/example-viewer-content.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExampleViewerSectionLabelComponent } from './components/example-viewer-section-label/example-viewer-section-label.component';
import { PropsFormControlDisabledComponent } from './components/props-form-control-disabled/props-form-control-disabled.component';
import { PropsFormControlValidatorsComponent } from './components/props-form-control-validators/props-form-control-validators.component';
import { RadioGroupModule } from '../../../../../src/lib/components/radio-group/radio-group.module';
import { ExampleViewerSectionComponent } from './components/example-viewer-section/example-viewer-section.component';
import { ExampleViewerPropertyComponent } from './components/example-viewer-property/example-viewer-property.component';
import { ExampleViewerComponent } from './components/example-viewer/example-viewer.component';
import { CodeModule } from '../code/code.module';
import { PropsSelectComponent } from './components/props-select/props-select.component';
import { SelectModule } from '../../../../../src/lib/components/select/select.module';
import { PropsSwitcherComponent } from './components/props-switcher/props-switcher.component';
import { SwitcherModule } from '../../../../../src/lib/components/switcher/switcher.module';
import { ExampleViewerPropertyDescriptionDirective } from './directives/example-viewer-property-description.directive';
import { ExampleViewerConfigItemComponent } from './components/example-viewer-config-item/example-viewer-config-item.component';
import { ExampleViewerConfigItemDescriptionDirective } from './directives/example-viewer-config-item-description.directive';

const EXPORTS: Type<unknown>[] = [
  ExampleViewerContentComponent,
  PropsRadioSelectComponent,
  PropsSelectComponent,
  PropsSwitcherComponent,
  ExampleViewerSectionLabelComponent,
  PropsFormControlDisabledComponent,
  PropsFormControlValidatorsComponent,
  ExampleViewerSectionComponent,
  ExampleViewerPropertyComponent,
  ExampleViewerComponent,
  ExampleViewerPropertyDescriptionDirective,
  ExampleViewerConfigItemDescriptionDirective,
  ExampleViewerConfigItemComponent,
];

const IMPORTS: (Type<unknown> | ModuleWithProviders<unknown>)[] = [
  CommonModule,
  RadioGroupModule,
  SelectModule,
  SwitcherModule,
  ReactiveFormsModule,
  CodeModule,
];

@NgModule({
  declarations: EXPORTS,
  imports: IMPORTS,
  exports: EXPORTS,
})
export class ExampleViewerModule {}
