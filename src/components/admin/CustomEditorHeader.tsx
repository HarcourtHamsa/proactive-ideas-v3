import React from "react"

function CustomEditorHeader({ value, onChange }: { value: any, onChange: (e: any) => void }) {
    return (
        <input
            className='h-10 px-4 font-2 w-full text-2xl outline-none mb-2 py-2 font-bold focus:outline-none'
            id="editor-header"
            value={value}
            onChange={onChange}
            name='title'
            placeholder='Enter Heading...'
        />
    )
}

export default CustomEditorHeader