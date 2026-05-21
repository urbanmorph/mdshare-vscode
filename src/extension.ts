import * as vscode from "vscode";

const API_URL = "https://mdshare.live/api/documents";
const VERSION = "0.3.4";

async function upload(content: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "User-Agent": `mdshare-vscode/${VERSION}`,
    },
    body: content,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }
  const data = (await res.json()) as { admin_url: string };
  return data.admin_url;
}

async function shareFile(uri: vscode.Uri) {
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
  } catch (err: any) {
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
  } catch (err: any) {
    vscode.window.showErrorMessage(`mdshare: ${err.message}`);
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("mdshare.shareFile", shareFile),
    vscode.commands.registerCommand("mdshare.shareSelection", shareSelection)
  );
}

export function deactivate() {}
