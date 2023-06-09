import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, ContentState, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface ITextEditorProps {
  value: string;
  setFieldValue: (val: string) => void;
}

export const RichEditor = ({ value, setFieldValue }: ITextEditorProps) => {
  const prepareDraft = (value: string) => {
    const draft = htmlToDraft(value);
    const contentState = ContentState.createFromBlockArray(draft.contentBlocks);
    const editorState = EditorState.createWithContent(contentState);
    return editorState;
  };

  const [editorState, setEditorState] = useState(
    value ? prepareDraft(value) : EditorState.createEmpty()
  );

  const onEditorStateChange = (editorState: EditorState) => {
    const forFormik = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setFieldValue(editorState.getCurrentContent().hasText() ? forFormik: "");
    setEditorState(editorState);
  };
  return (
    <Editor
      editorState={editorState}
      wrapperClassName="demo-wrapper"
      editorClassName="demo-editor"
      editorStyle={{ paddingInline: "16px" }}
      toolbarStyle={{ background: "#967959", color: "black" }}
      onEditorStateChange={onEditorStateChange}
      stripPastedStyles={true}
    />
  );
};

export default RichEditor;
