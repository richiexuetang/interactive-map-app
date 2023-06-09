import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const RichEditor = ({ editorState, setEditorState }) => {
  return (
    <Editor
      editorState={editorState}
      wrapperClassName="demo-wrapper"
      editorClassName="demo-editor"
      editorStyle={{ paddingInline: "16px" }}
      toolbarStyle={{background: "#967959", color: "black"}}
      onEditorStateChange={setEditorState}
      stripPastedStyles={true}
    />
  );
};

export default RichEditor;