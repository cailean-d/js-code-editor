import React from 'react';
import { render } from 'react-dom';
import EditorComponent from './components/editor';
import { StoreContext, createStore } from './utils/store';
import 'mobx-react-lite/batchingForReactDom';

export class Editor {
  components = createStore();

  constructor(target: HTMLElement) {
    render(
      <StoreContext.Provider value={this.components}>
        <EditorComponent/>
      </StoreContext.Provider>,
      target
    );
  }

  test() {
    console.log('just a test imperative api')
  }
}
