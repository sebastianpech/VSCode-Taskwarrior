import * as vscode from "vscode";
import { Completer } from './completer';
import { Hoverer } from './hoverer';
import { Taskwarrior } from './taskwarrior';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.helloWorld", () => {
    })
  );
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { scheme: 'file', language: 'taskwarrior' },
      new Completer(),
      ' ', '.',
    )
  );
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
        { scheme: 'file', language: 'taskwarrior' },
      new Hoverer()
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() { }
