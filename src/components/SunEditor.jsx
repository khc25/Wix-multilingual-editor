import * as React from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form"
import katex from 'katex'
import 'katex/dist/katex.min.css'

const defaultFonts = [
    "Arial",
    "Comic Sans MS",
    "Courier New",
    "Impact",
    "Georgia",
    "Tahoma",
    "Trebuchet MS",
    "Verdana"
];


export default function SunEditorPage({ setValue, initData }) {
    const [blog, setBlog] = React.useState(initData);
    // const { t, i18n } = useTranslation();

    const sortedFontOptions = [
        "Logical",
        "Salesforce Sans",
        "Garamond",
        "Sans-Serif",
        "Serif",
        "Times New Roman",
        "Helvetica",
        ...defaultFonts
    ].sort();

    React.useEffect(() => {
        setValue(blog);
    }, [blog])

    return (
        <div>
            <SunEditor
                setContents={blog}
                onChange={setBlog}
                // placeholder={t(placeholder || '')}
                // {...register(value)}
                setOptions={{
                    buttonList: [
                        ["undo", "redo"],
                        ["font", "fontSize"],
                        ['paragraphStyle', 'blockquote'],
                        [
                            "bold",
                            "underline",
                            "italic",
                            "strike",
                            "subscript",
                            "superscript"
                        ],
                        ["fontColor", "hiliteColor"],
                        ["align", "list", "lineHeight"],
                        ["outdent", "indent"],

                        ["table", "horizontalRule", "link", "image", "video", "audio"],
                        ['math'], //You must add the 'katex' library at options to use the 'math' plugin.
                        // ['imageGallery'], // You must add the "imageGalleryUrl".
                        // ["fullScreen", "showBlocks", "codeView"],
                        ["showBlocks", "codeView"],
                        ["preview", "print"],
                        ["removeFormat"],
                        // ["'splitCells'"]

                        // ['save', 'template'],
                        // '/', Line break
                    ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                    defaultTag: "div",
                    minHeight: "300px",
                    showPathLabel: false,
                    font: sortedFontOptions,
                    katex: katex,
                
                }}
            />
            <hr />
            {/* <h2>Example value output:</h2>
            <textarea
                disabled
                value={JSON.stringify(value, null, 2)}
                style={{ width: "100%", resize: "none", height: "600px" }}
            /> */}
            {/* <h1>Preview</h1>
            <div dangerouslySetInnerHTML={{
                __html: value ?? ''
            }} /> */}
        </div>
    );
}
