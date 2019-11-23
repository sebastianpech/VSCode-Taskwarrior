import * as vscode from "vscode";
import {
    Position,
    TextDocument,
    CancellationToken,
} from "vscode";
import { Taskwarrior } from "./taskwarrior";

export class Hoverer implements vscode.HoverProvider {
    space_separated = new RegExp('[^ ]+');
    uuid = new RegExp('([a-z0-9]{4,}-*){5}');

    t: Taskwarrior;
    constructor() {
        this.t = new Taskwarrior();
    }

    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken
    ): Thenable<vscode.Hover> {
        return new Promise((resolve, _reject) => {
            const spaceSep = document.getWordRangeAtPosition(
                position,
                this.space_separated
            );
            const name = document.getText(spaceSep);
            if (name.match(this.uuid)) {
                this.t.task_info_by_uuid(name).then((value) => {
                    let description = new vscode.MarkdownString("```\n" + value + "\n```");
                    resolve(new vscode.Hover(description, spaceSep));
                    return;
                });
            } else {
                this.t.project_status(name).then((value) => {
                    if (value !== "") {
                        let description = new vscode.MarkdownString("```\n" + value + "\n```");
                        resolve(new vscode.Hover(description, spaceSep));
                        return;
                    }
                });
            }
        });
    }
}