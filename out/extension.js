"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const API_URL = "https://mdshare.live/api/documents";
async function upload(content) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: content,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed (${res.status}): ${text}`);
    }
    const data = (await res.json());
    return data.admin_url;
}
async function shareFile(uri) {
    try {
        const bytes = await vscode.workspace.fs.readFile(uri);
        const content = Buffer.from(bytes).toString("utf-8");
        if (!content.trim()) {
            vscode.window.showWarningMessage("File is empty.");
            return;
        }
        const url = await upload(content);
        await vscode.env.clipboard.writeText(url);
        vscode.window.showInformationMessage("Shared! Admin URL copied to clipboard.");
    }
    catch (err) {
        vscode.window.showErrorMessage(`mdshare: ${err.message}`);
    }
}
async function shareSelection() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage("No active editor.");
        return;
    }
    const selection = editor.document.getText(editor.selection);
    if (!selection.trim()) {
        vscode.window.showWarningMessage("Selection is empty.");
        return;
    }
    try {
        const url = await upload(selection);
        await vscode.env.clipboard.writeText(url);
        vscode.window.showInformationMessage("Shared! Admin URL copied to clipboard.");
    }
    catch (err) {
        vscode.window.showErrorMessage(`mdshare: ${err.message}`);
    }
}
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("mdshare.shareFile", shareFile), vscode.commands.registerCommand("mdshare.shareSelection", shareSelection));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map