import React from "react";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const RichEditor = ({editorState, setEditorState}) => {
    return (
        <div>
            <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={setEditorState}
                stripPastedStyles={true}
            />
        </div>
    );
};

export default RichEditor;
