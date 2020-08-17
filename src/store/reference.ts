import { observable } from 'mobx';

export default class Reference {
  @observable measureElement: HTMLElement;
  @observable measureScrollElement: HTMLElement;
  @observable textLayer: HTMLElement;
  @observable inputElement: HTMLElement;
  @observable editorElement: HTMLElement;
}
