import { storiesOf } from '@storybook/angular';

import { DraggableListModule } from './draggable-list.module';

const list: any[] = [
  {
    id: '1',
    content: '🐢'
  },
  {
    id: '2',
    content: '🐍'
  },
  {
    id: '3',
    content: '🦖'
  },
  {
    id: '4',
    content: '🐊'
  },
  {
    id: '5',
    content: '🦎'
  }
];

storiesOf('Draggable List', module).add('default', () => ({
  moduleMetadata: {
    imports: [DraggableListModule]
  },
  template: `
    <style>
    pupa-draggable-list-item {
      display: block;
      position: relative;
      z-index: 1;
      box-sizing: border-box;
    }

    pupa-draggable-list {
      user-select: none;
    }
    </style>

    <pupa-draggable-list>
      <pupa-draggable-list-item
        *ngFor="let item of list; let i = index"
        [id]="item.id"
        [index]="i"
      >
        <div style="padding: 5px; background: #ccc; border-radius: 8px">
          {{ item.id }}. {{ item.content }}
        </div>
      </pupa-draggable-list-item>
    </pupa-draggable-list>
  `,
  props: {
    list
  }
}));
