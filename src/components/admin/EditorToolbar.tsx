import React from "react";
import { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";
import 'quill-image-uploader/dist/quill.imageUploader.min.css';
import ImageResize from 'quill-image-resize-module-react';
import { EmbedBlot } from 'parchment';
import BlotFormatter from 'quill-blot-formatter';
import { TbHtml, TbMusic } from "react-icons/tb";

const Link = Quill.import('formats/link');

Quill.register("modules/imageUploader", ImageUploader);
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/blotFormatter', BlotFormatter);


class CustomAudio extends EmbedBlot {
    static create(value: any) {
        const node = super.create(value);

        const audio = document.createElement('audio')
        audio.setAttribute('controls', 'true');
        audio.setAttribute('type', "audio/mp3");
        audio.setAttribute('src', this.sanitize(value));
        node.appendChild(audio);

        return node;
    }

    static sanitize(url: any) {
        return Link.sanitize(url);
    }

};
CustomAudio.blotName = 'audio';
CustomAudio.className = 'ql-audio';
CustomAudio.tagName = 'DIV';

Quill.register(CustomAudio)



// let Block = Quill.import('blots/block');
// let Inline = Quill.import('blots/inline');
// let Embed = Quill.import('blots/block/embed');

// class DetailsBlot extends Block { }
// DetailsBlot.blotName = 'details';
// DetailsBlot.tagName = 'details';
// Quill.register(DetailsBlot);


// class SummaryBlot extends Inline { }
// DetailsBlot.blotName = 'summary';
// DetailsBlot.tagName = 'summary';
// Quill.register(SummaryBlot);


// class Hr extends Embed {
//   static create(value: any) {
//     let node = super.create();
//     return node;
//   }
// }


// Hr.blotName = 'hr';
// Hr.tagName = 'hr';
// Hr.className = 'custom-hr';

// Quill.register({
//   'formats/hr': Hr
// });






const CustomUndo = () => (
    <svg viewBox="0 0 18 18">
        <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
        <path
            className="ql-stroke"
            d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
        />
    </svg>
);


const CustomRedo = () => (
    <svg viewBox="0 0 18 18">
        <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
        <path
            className="ql-stroke"
            d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
        />
    </svg>
);



// Undo and redo functions for Custom Toolbar
function undoChange(this: {
    [x: string]: any; undo: () => void; redo: () => void;
}) {
    this.quill.history.undo();
}


function redoChange(this: {
    [x: string]: any; undo: () => void; redo: () => void;
}) {
    this.quill.history.redo();
}




// Add sizes to whitelist and register them
// const Size = Quill.import("formats/size");
// Size.whitelist = ["extra-small", "small", "medium", "large"];
// Quill.register(Size, true);



// Modules object for setting up the Quill editor
export const modules = {
    blotFormatter: {},
    toolbar: {
        container: "#toolbar",
        handlers: {
            undo: undoChange,
            redo: redoChange,
        }
    },
    history: {
        delay: 500,
        maxStack: 100,
        userOnly: true
    }
    ,
    imageUploader: {
        upload: (file: any) => {
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "hqdnnphw");

                fetch(
                    "https://api.cloudinary.com/v1_1/dgn6edv1k/image/upload",
                    {
                        method: "POST",
                        body: formData
                    }
                )
                    .then((response) => response.json())
                    .then((result) => {
                        resolve(result.secure_url);
                    })
                    .catch((error) => {
                        reject("Upload failed");
                        console.error("Error:", error);
                    });
            });
        }
    },
    imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize']
    },
};

// Formats objects for setting up the Quill editor
export const formats = [
    "table",
    "header",
    // "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "imageBlot",
    "color",
    "code-block",
    "summarize",
    "video",
];

// Quill Toolbar component
export const EditorToolbar = ({ onClickRaw }: any) => (
    <div id="toolbar">
        <span className="ql-formats">
            <select className="ql-header" defaultValue="3">
                <option value="1">Heading</option>
                <option value="2">Subheading</option>
                {/* <option value="3">Normal</option> */}
            </select>
        </span>
        <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
        </span>
        <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
            {/* <button className="ql-script" value="super" />
            <button className="ql-script" value="sub" /> */}
            <button className="ql-blockquote" />

        </span>
        <span className="ql-formats">
            <select className="ql-align" />
            <select className="ql-color" />
            <select className="ql-background" />
        </span>
        <span className="ql-formats">
            <button className="ql-link" />
            <button className="ql-image" />
            <button className="ql-video" />
            <button className="ql-audio">
                <TbMusic />
            </button>

        </span>
        <span className="ql-formats">
            {/* <button className="ql-formula" /> */}
            <button className="ql-code-block" />
            <button className="ql-clean" />
        </span>
        <span className="ql-formats">
            <button className="ql-undo">
                <CustomUndo />
            </button>
            <button className="ql-redo">
                <CustomRedo />
            </button>
            <button className="ql-html" onClick={onClickRaw}>
                <TbHtml />
            </button>
        </span>
    </div>
);

export default EditorToolbar;
