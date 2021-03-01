import React, { useState, useEffect } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import { CopyOutlined } from "@ant-design/icons";
import { message, Spin } from "antd";
import "codemirror/mode/vue/vue";
import "codemirror/mode/jsx/jsx";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import parseCodeToCss from "parse-jsx-to-css/lib/index";
import "./index.less";
import debounce from "lodash.debounce";
import copy from "copy-to-clipboard";
import {getDefaultCode,setDefaultCode} from '../../storage'


const defaultCss = `
.main-app{

}
`;

export default function Editor(props) {
  const { language, outType } = props;
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState(getDefaultCode());
  const [cssCode, setCSSCode] = useState(defaultCss);
  useEffect(() => {
    setLoading(true);

    try {
      parseCodeToCss({
        input: code,
        transformType: "code",
        language: language,
        outType: outType,
        callback: (res) => {
          setLoading(false);
          setCSSCode(res);
        },
      });
    } catch (error) {
      message.error(`transform ${language} to ${outType} error!`);
      setLoading(false);
    }
  }, [cssCode, code, language, outType,setLoading]);

  return (
    <div className="main-editor">
      <div className="input-editor">
        <CodeMirror
          value={code}
          options={{
            mode: language === "vue" ? "vue" : "jsx",
            theme: "material",
            lineNumbers: true,
          }}
          onChange={debounce((editor, data, value) => {
            setCode(value);
            setDefaultCode(value);
          }, 1500)}
        />
      </div>
      <div className="output-editor">
        <div
          className="copy-code"
          onClick={() => {
            if (copy(cssCode)) {
              message.success("copy success!");
            } else {
              message.error("copy error，please select code and copy");
            }
          }}
        >
          <CopyOutlined />
        </div>
        <Spin tip="loading..." spinning={loading}>
          <CodeMirror
            value={cssCode}
            options={{
              mode: "css",
              theme: "material",
              lineNumbers: true,
            }}
            onChange={(editor, data, value) => {}}
          />
        </Spin>
      </div>
    </div>
  );
}
