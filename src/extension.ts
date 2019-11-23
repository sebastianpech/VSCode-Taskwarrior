import * as vscode from "vscode";
import { Completer } from './completer';
import { Hoverer } from './hoverer';
import { Taskwarrior } from './taskwarrior';
import { isUndefined } from "util";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("taskwarrior.taskadd", () => {
      const t = new Taskwarrior();

      const task_definition = vscode.window.showInputBox({
        prompt: `Describe task`,
        value: "",
      });

      task_definition.then((value) => {
        if (!isUndefined(value)) {
          t.add(value).then((ret) => {
            vscode.window.showInformationMessage(ret);
          });
        }
      });
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
