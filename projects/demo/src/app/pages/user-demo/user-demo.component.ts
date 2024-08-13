import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { appStarFilledIcon } from '@bimeister/pupakit.icons';
import { AvatarSize, UserKind } from '@bimeister/pupakit.kit';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';
import { FormStructure } from '../../shared/declarations/types/form-structure.type';

const BASE_PATH: string = 'user-demo/examples';

interface UserSettings {
  kind: UserKind;
  avatarSize: AvatarSize;
  fullName: string;
  fullNameIcon: string;
  description: string;
}

@Component({
  selector: 'demo-user-demo',
  templateUrl: './user-demo.component.html',
  styleUrl: './user-demo.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDemoComponent {
  public readonly userSettingsForm: FormGroup<FormStructure<UserSettings>> = new FormGroup<FormStructure<UserSettings>>(
    {
      kind: new FormControl<UserKind>('full'),
      avatarSize: new FormControl<AvatarSize>('large'),
      fullName: new FormControl<string>('Фамилия Имя Отчество'),
      fullNameIcon: new FormControl<string>(appStarFilledIcon.name),
      description: new FormControl<string>('Должность Отдел Компания'),
    }
  );

  public readonly avatarSizes: PropsOption[] = [
    {
      caption: 'Large',
      value: 'large',
      isDefault: true,
    },
    {
      caption: 'Medium',
      value: 'medium',
    },
    {
      caption: 'Small',
      value: 'small',
    },
  ];

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_PATH}/example-1/example-1.component.html`,
  };
}
