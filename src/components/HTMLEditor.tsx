export class HtmlEditor {
    quill: any;
    options: any;
    textarea: any;

    constructor(quill: any, options = {}) {
        this.quill = quill;
        this.options = options;

        this.addTextarea();
        this.bindEditorBehavior();
        this.bindButtonBehavior();
    }

    addTextarea() {
        let container = this.quill.addContainer('ql-custom');

        this.textarea = document.createElement('textarea');
        this.textarea.className = "ql-edit-html-textarea";
        this.textarea.style.display = "none";

        container.appendChild(this.textarea);
    }

    bindEditorBehavior() {
        let editor = document.querySelector('.ql-editor');

        this.quill.on('text-change', () => {
            if (editor) {
                let html = editor.innerHTML;

                this.textarea.value = html;
            }
        });
    }

    bindButtonBehavior() {
        let button = document.querySelector('.ql-edit-html');

        if (button) {
            button.addEventListener('click', () => {
                if (this.textarea.style.display === '') {
                    let html = this.textarea.value;

                    this.quill.pasteHTML(html);
                }

                this.textarea.style.display =
                    this.textarea.style.display === 'none'
                        ? ''
                        : 'none';
            });
        }
    }
}