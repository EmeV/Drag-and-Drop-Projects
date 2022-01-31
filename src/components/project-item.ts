import { Draggable } from "../models/drag-and-drop.js";
import { Component } from "./base-components.js";
import { autobind } from "../decorators/autobind.js";
import { Project } from "../models/project.js";

// ProjectItem Class
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    }
    return `${this.project.people}` + " people";
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent): void {
    //add data we want to transfer
    //how can dataTransfer be null? it can be used in dragEndas well, where we might not have the data anymore
    event.dataTransfer!.setData("text/plain", this.project.id); //the first param is format, which is predefines list of possible formats
    event.dataTransfer!.effectAllowed = "move"; //change icon of cursor
  }

  dragEndHandler(_t: DragEvent) {
    console.log("DragEnded");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler); //could also do bind()
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons;
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
