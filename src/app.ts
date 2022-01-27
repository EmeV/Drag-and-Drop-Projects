//validation
interface Validatble {
  vaule: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatable: Validatble) {
  let isValid = true;
  if (validatable.required) {
    isValid = isValid && validatable.vaule.toString().trim().length !== 0; //nr to string -> okey; string.toString okey
  }
  if (validatable.minLength != null && typeof validatable.vaule === "string") {
    //if minLength = 0 we would skip this, so add check != 0
    isValid = isValid && validatable.vaule.length > validatable.minLength;
  }
  if (validatable.maxLength != null && typeof validatable.vaule === "string") {
    isValid = isValid && validatable.vaule.length < validatable.maxLength;
  }
  if (validatable.min != null && typeof validatable.vaule === "number") {
    isValid = isValid && validatable.vaule > validatable.min;
  }
  if (validatable.max != null && typeof validatable.vaule === "number") {
    isValid = isValid && validatable.vaule < validatable.max;
  }
  return isValid;
}

//autobind decorater
// function autobind(tartget: any, methodName: string, descriptor: PropertyDescriptor){ //original, but we do not use 2 of the params
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

//Project Type
enum ProjectStatus {
  Acitve,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {
    //add property "public" to automatically create fields as atr
  }
}

type Listener<T> = (items: T[]) => void; //a function receiving a list of Projectd, and we don't need a returned value

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
      }
}

//Project State Management
class ProjectState extends State<Project> {
  private static instance: ProjectState;
  private projects: Project[] = [];

  private constructor() {
      super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addproject(title: string, desc: string, nrPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      desc,
      nrPeople,
      ProjectStatus.Acitve
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); //slice: return a copy of the array, not the original(it would be a reference), so the listener cannot edit the list from outside
    }
  }

}

//component base Class ~ a rendereble object for the UI
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    instertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById(templateId)!
    );
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(instertAtStart);
  }

  private attach(instertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      instertAtStart ? "afterbegin" : "beforeend",
      this.element
    ); //if instertAtStart is true -> user "afterbegin, elese "beforeend"
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

//ProjectListClass
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {     //this is part of name which is used in DOM elements, so case matters
    super("project-list", "app", false, `${type}-projects`);

    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  renderContent() {
    //add an Id
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId; //get the unordered List (ul)
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  configure() {
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        //if the result of filter fuction is true we keep the value in the new Array, if false, it is ignored
        if (this.type === "active") {
          return prj.status === ProjectStatus.Acitve;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = ""; //basically clear list
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }
}

//ProjectInput Class
class ProjectInput extends Component<HTMLDivElement,HTMLFormElement > {
  titleInputelement: HTMLInputElement;
  descriptionInputelement: HTMLInputElement;
  peopleInputelement: HTMLInputElement;

  constructor() {
      super("project-input","app", true, "user-input");

    // const importedNode = document.importNode(
    //   this.templateElement.content,
    //   true
    // );
    // this.element = importedNode.firstElementChild as HTMLFormElement; //the form
    // this.element.id = "user-input"; //formating using app.css

    //get access to different inputs of the form
    this.titleInputelement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement; //using id from input.html
    this.descriptionInputelement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement; //using id from input.html
    this.peopleInputelement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement; //using id from input.html

    //add eventlistener
    this.configure();
  }

  private gatherUserInput(): [string, string, number] | void {
    //tuple or nothing in case of error
    const enteredTitle = this.titleInputelement.value;
    const enteredDescription = this.descriptionInputelement.value;
    const enteredPeople = this.peopleInputelement.value;

    const titleValid: Validatble = {
      vaule: enteredTitle,
      required: true,
    };
    const descValid: Validatble = {
      vaule: enteredDescription,
      required: true,
      minLength: 3,
    };
    const peopleValid: Validatble = {
      vaule: enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    //validate
    if (
      !validate(titleValid) ||
      !validate(descValid) ||
      !validate(peopleValid)
    ) {
      alert("invalid input. need all fields");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  configure() {
    //set up an eventlistener
    //his.element.addEventListener('submit', this.submitHandler); //original simple example -> works, but this.titleInputelement will not be visible
    // this.element.addEventListener("submit", this.submitHandler.bind(this)); //here we are binging the current context (this) the context of the eventhandler -> not needed if we have the autobind decorator
    this.element.addEventListener("submit", this.submitHandler); //version for autobind decorator
  }

  renderContent(): void { }

  private clearInput() {
    this.titleInputelement.value = "";
    this.descriptionInputelement.value = "";
    this.peopleInputelement.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault(); //prevent default form submission, which would trigger an http request(?)
    //console.log(this.titleInputelement.value); // does not work without bind(this), because the method was bound to something, so the contex of this is not the class, but the current target of the event
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      projectState.addproject(title, desc, people);
      this.clearInput();
    }
  }

}

const projectState = ProjectState.getInstance();
const pInput = new ProjectInput();
const activeProjList = new ProjectList("active");
const finishedProjList = new ProjectList("finished");
