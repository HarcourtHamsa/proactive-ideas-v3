import React, { useState } from 'react';
import CKEditor from 'react-ckeditor-component';


const toolbarConfig = {
  toolbar: 'Full',
  allowedContent: true,
  startupFocus: true,
  // Rest of the toolbar configuration
};

const CKEditorComponent = () => {
  const [content, setContent] = useState('content');

  const onChange = (evt: any) => {
    console.log('onChange fired with event info: ', evt);
    const newContent = evt.editor.getData();
    setContent(newContent);
  };

  return (
    <div>
      {content}
      <CKEditor
        activeClass="p10"
        config={toolbarConfig}
        content={content}
        events={{
          change: onChange
        }}
      />
    </div>
  );
};

export default CKEditorComponent;
