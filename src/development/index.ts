import './index.css';
import { Editor } from '@/index';

const code = `
fn main() {
  let a = 5;
  let str = "hi there";
}

fn add(a: i32, b: i32) {
  ret a + b;
}

fn test(num: u32) {
  if num > 10
    ret 5;
  elif num == 5
    ret 10;
  else
    ret 15;
}
`;

const editor = new Editor(document.querySelector('#root'), { value: code });
(window as any).editor = editor;
console.log(editor);
