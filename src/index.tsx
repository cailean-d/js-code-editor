import React from 'react';
import { render } from 'react-dom';
import EditorComponent from './components/editor';
import GutterLayer from './components/gutterLayer';
import MainLayer from './components/mainLayer';
import { StoreContext, createStore } from './utils/store';
import { IOptions } from './interfaces/options';
import 'mobx-react-lite/batchingForReactDom';
import './themes/default.css';

export class Editor {
  components = createStore();

  constructor(target: HTMLElement, options: IOptions = {}) {
    this.mergeOptions(options);
    this.renderEditor(target);
  }

  mergeOptions(options: IOptions) {
    this.components.options.merge(options);
  }

  renderEditor(target: HTMLElement) {
    render(
      <StoreContext.Provider value={this.components}>
        <EditorComponent>
          <GutterLayer/>
          <MainLayer/>
        </EditorComponent>
      </StoreContext.Provider>,
      target
    );
  }
}
