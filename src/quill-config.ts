import Quill from 'quill';
import { HtmlEditor } from './components/HTMLEditor';
// import { HtmlEditor } from './html-editor'

Quill.register('modules/htmlEditor', HtmlEditor);

export class QuillConfig {
    constructor() {
        this.modules = {
            htmlEditor: true
        }
    }

    public modules = {};
}