import React from 'react'
import { Editor } from "@tinymce/tinymce-react"
import { Controller } from 'react-hook-form'

export default function RTE({ name, control, label, defaultValue = "" }) {
    return (
        <div className='w-full'>
            {
                label && <label className='inline-block mb-1 pl-1'>{label}</label>
            }

            <Controller
                name={name || "Content"}
                control={control}
                render={(({ field: { onChange } }) => (
                    <Editor
                        initialValue={defaultValue}
                        init={{
                            height: 500,
                            menubar: false,

                            plugins: [
                                // Core editing features
                                'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                // Premium features
                                'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'tinymceai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                            ],
                            toolbar: 'undo redo | tinymceai-chat tinymceai-quickactions tinymceai-review | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',

                        }}

                        onEditorChange={onChange}
                    />
                ))}
            />
        </div>
    )
}
