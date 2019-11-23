import * as vscode from "vscode";
import {
    Position,
    TextDocument,
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemKind
} from "vscode";
import { Taskwarrior } from "./taskwarrior";

export class Completer implements vscode.CompletionItemProvider {
    t: Taskwarrior;
    isProjectLine = new RegExp("^  Project:(.*)$");
    isTagsLine = new RegExp("^  Tags:.*$");

    constructor() {
        this.t = new Taskwarrior();
    }
    provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken,
        context: CompletionContext
    ): Promise<CompletionItem[] | vscode.CompletionList> {
        const triggerCharacter = context.triggerCharacter;
        const textBefore = document
            .lineAt(position.line)
            .text.substring(0, position.character);
        return new Promise((resolve, _reject) => {
            if (textBefore.match(this.isProjectLine)) {
                this.t.projects_for_completion().then(val => {
                    const match = textBefore.match(this.isProjectLine);
                    let fullproject = [""];
                    let rootElement = "";
                    let childElement = "";
                    if (match !== null && match.length === 2) {
                        fullproject = match[1].trim().split(".");
                        rootElement = fullproject.slice(0, -1).join(".");
                        childElement = fullproject.slice(-1)[0];
                        if (match[1].endsWith(".")) {
                            rootElement += ".";
                        }
                    }
                    const list = val
                        .split("\n")
                        .filter((value, _, __) => value.startsWith(rootElement))
                        .map(x => {
                            return new CompletionItem(x.substring(rootElement.length), CompletionItemKind.Value);
                        });
                    if (list.length === 0) {
                        _reject();
                    } else {
                        resolve(list);
                    }
                });
            } else if (textBefore.match(this.isTagsLine)) {
                this.t.tags_for_completion().then(val => {
                    const list = val
                        .split("\n")
                        .map(x => new CompletionItem(x, CompletionItemKind.Value));
                    resolve(list);
                });
            } else {
                _reject();
            }
        });
    }
}
