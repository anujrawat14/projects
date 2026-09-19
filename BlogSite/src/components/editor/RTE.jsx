import React, { useEffect } from 'react'
import { Editor } from "@tinymce/tinymce-react"
import { Controller } from "react-hook-form"
import Conf from '../../conf/Conf'

function RTE({ name, control, label, defaultValue = "" }) {

    return (
        <div className='w-full'>
            {
                label && <label className='inline-block mb-1 pl-1'> {label}</label>
            }
            <Controller
                name={name || "Content"}
                control={control}

                render={({ field: { onChange } }) => (
                    <Editor
                        apiKey={Conf.tinymce_editor_API_key}
                        initialValue={defaultValue}
                        init={{
                            height: 500,
                            readonly: false,

                            plugins: [
                                "image", "advlist", "autolink", "lists", "link", "image", "charmap", "preview", "anchor", "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table", "code", "help", "wordcount", "anchor",
                            ],

                            toolbar: "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",

                            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        }}
                        onEditorChange={onChange}//give sme function a s used in field
                    />
                )}
            />

        </div>
    )


}

export default RTE

