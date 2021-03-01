export function getDefaultLanguage() {
  return localStorage.getItem("parse-to-css:language") || "react";
}
export function setDefaultLanguage(language) {
  return localStorage.setItem("parse-to-css:language", language);
}

export function getDefaultType() {
  return localStorage.getItem("parse-to-css:out-type") || "less";
}
export function setDefaultType(type) {
  return localStorage.setItem("parse-to-css:out-type", type);
}

const defaultCode = `
import React from 'react'

export default function App() {
    return (
        <div className='main-app'>
            hello, mrgaogang.github.io
        </div>
    )
}
`;

export function getDefaultCode() {
  return localStorage.getItem("parse-to-css:code") || defaultCode;
}
export function setDefaultCode(code) {
  return localStorage.setItem("parse-to-css:code", code);
}
