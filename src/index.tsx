import React from 'react';
import { render } from 'react-dom';
import EditorComponent from './components/editor';

export class Editor {
  constructor(target: HTMLElement) {
    render(<EditorComponent/>, target);
  }

  test() {
    console.log('just a test imperative api')
  }
}
