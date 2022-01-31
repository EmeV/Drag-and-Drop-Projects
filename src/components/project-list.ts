namespace App{
    
// ProjectList Class
export class ProjectList
extends Component<HTMLDivElement, HTMLElement>
implements DragTarget
{
assignedProjects: Project[];

constructor(private type: "active" | "finished") {
  super("project-list", "app", false, `${type}-projects`);
  this.assignedProjects = [];

  this.configure();
  this.renderContent();
}

@autobind
dragOverHandler(event: DragEvent): void {
  //first check if type of data we are dragining is dropable here
  if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
    event.preventDefault(); //must do this, otherwise drop not possible in the area; the deafault is not to allow droping.
    //change visual, to show, that this is a dropabl area
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.add("droppable"); //dropable is a class defined in app.css
  }
}

@autobind
dropHandler(event: DragEvent): void {
  const prjId = event.dataTransfer!.getData("text/plain");
  projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished );
}

@autobind
dragLeaveHandler(_: DragEvent): void {
  //change visual, remove class dropableea
  const listEl = this.element.querySelector("ul")!;
  listEl.classList.remove("droppable"); //dropable is a class defined in app.css
}

configure() {
  projectState.addListener((projects: Project[]) => {
    const relevantProjects = projects.filter((prj) => {
      if (this.type === "active") {
        return prj.status === ProjectStatus.Active;
      }
      return prj.status === ProjectStatus.Finished;
    });
    this.assignedProjects = relevantProjects;
    this.renderProjects();
  });
  this.element.addEventListener("dragover", this.dragOverHandler);
  this.element.addEventListener("dragleave", this.dragLeaveHandler);
  this.element.addEventListener("drop", this.dropHandler);
}

renderContent() {
  const listId = `${this.type}-projects-list`;
  this.element.querySelector("ul")!.id = listId;
  this.element.querySelector("h2")!.textContent =
    this.type.toUpperCase() + " PROJECTS";
}

private renderProjects() {
  const listEl = document.getElementById(
    `${this.type}-projects-list`
  )! as HTMLUListElement;
  listEl.innerHTML = "";
  for (const prjItem of this.assignedProjects) {
    new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
  }
}
}
}