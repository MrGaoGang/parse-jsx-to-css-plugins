"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const parse_jsx_to_css_1 = require("parse-jsx-to-css");
const fs = require("fs");
const path = require("path");
let panel;
function transform(filePath, outType, context) {
    if (filePath) {
        const code = fs.readFileSync(filePath, {
            encoding: "utf-8",
        });
        try {
            parse_jsx_to_css_1.default({
                input: code,
                transformType: "code",
                language: getLanguage(filePath),
                outType: outType,
                callback: (res) => {
                    if (!panel) {
                        panel = vscode.window.createWebviewPanel("parseToCSS", // 只供内部使用，这个webview的标识
                        "Parse To CSS", // 给用户显示的面板标题
                        vscode.ViewColumn.Two, // 给新的webview面板一个编辑器视图
                        {
                            enableScripts: true,
                            localResourceRoots: [
                                vscode.Uri.file(path.join(context.extensionPath, "template")),
                            ],
                        } // Webview选项。我们稍后会用上
                        );
                    }
                    else {
                        panel.reveal(vscode.ViewColumn.Two);
                    }
                    panel.webview.html = getWebviewContent(context, res, outType);
                    panel === null || panel === void 0 ? void 0 : panel.onDidDispose(() => {
                        panel = null;
                    }, null, context.subscriptions);
                },
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`parse the file to ${outType} failed!`);
        }
    }
}
function getLanguage(filePath) {
    const extension = (/\.([^.]*)$/.exec(filePath) || [])[0];
    return extension.slice(1) === "vue" ? "vue" : "react";
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "parse-to-css-vscode-plugin" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("parse-to-css-vscode-plugin.to.less", (params) => {
        // The code you place here will be executed every time your command is executed
        const filePath = params.fsPath;
        transform(filePath, "less", context);
    });
    context.subscriptions.push(disposable);
    let disposableCss = vscode.commands.registerCommand("parse-to-css-vscode-plugin.to.css", (params) => {
        const filePath = params.fsPath;
        transform(filePath, "css", context);
    });
    context.subscriptions.push(disposableCss);
    let disposableSass = vscode.commands.registerCommand("parse-to-css-vscode-plugin.to.scss", (params) => {
        // The code you place here will be executed every time your command is executed
        const filePath = params.fsPath;
        transform(filePath, "sass", context);
    });
    context.subscriptions.push(disposableSass);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    panel = null;
}
exports.deactivate = deactivate;
function getWebviewContent(context, code, style) {
    let html = getWebViewHtml(context, "./template/index.html");
    html = html.replace("<!-- REPLACE-CODE -->", code);
    html = html.replace("<!-- REPLACE-STYLE -->", `text/x-${style === 'sass' ? 'scss' : style === 'css' ? 'gss' : style}`);
    return html;
}
function getWebViewHtml(context, templatePath) {
    const resourcePath = path.join(context.extensionPath, templatePath);
    const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, "utf-8");
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        return ($1 +
            vscode.Uri.file(path.resolve(dirPath, $2))
                .with({ scheme: "vscode-resource" })
                .toString() +
            '"');
    });
    return html;
}
//# sourceMappingURL=extension.js.map