import { promisify } from "util";

const exec = require("child_process").exec;
const util = require("util");

export class Taskwarrior {
  _exec: Function;
  constructor() {
    this._exec = util.promisify(require("child_process").exec);
  }
  public async task(...command: string[]): Promise<string> {
    command.splice(0, 0, "task");
    const output = await this._exec(command.join(" "));
    return output.stdout;
  }
  public async projects_for_completion(): Promise<string> {
    return this.task("rc.list.all.projects=1", "_projects");
  }
  public async tags_for_completion(): Promise<string> {
    return this.task("_tags");
  }
  public async project_status(project: string): Promise<string> {
    const projects = (await this.projects_for_completion()).split("\n");
    if (projects.includes(project)) {
      return this.task("summary", "project:'" + project + "'");
    }
    return Promise.resolve("");
  }
  public async task_info_by_uuid(uuid: string): Promise<string> {
    return this.task(uuid,"info");
  }
  public async add(description: string): Promise<string> {
    return this.task("add", description);
  }
}
