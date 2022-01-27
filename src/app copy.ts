// // Code goes here!
// class ProjectInput {
//     templateElement: HTMLTemplateElement;
//     hostElement: HTMLDivElement;
//     element: HTMLFormElement;
//     titleInputelement: HTMLInputElement;
//     descriptionInputelement: HTMLInputElement;
//     peopleInputelement: HTMLInputElement;


//     constructor() {
//         this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
//         this.hostElement = document.getElementById('app')! as  HTMLDivElement;

//         const importedNode = document.importNode(this.templateElement.content, true);
//         this.element = importedNode.firstElementChild as HTMLFormElement; //the form
//         this.element.id = "user-input"; //formating using app.css

//         //get access to different inputs of the form
//         this.titleInputelement = this.element.querySelector('#title')! as HTMLInputElement; //using id from input.html
//         this.descriptionInputelement = this.element.querySelector('#description')! as HTMLInputElement; //using id from input.html
//         this.peopleInputelement = this.element.querySelector('#people')! as HTMLInputElement; //using id from input.html

//         //add eventlistener
//         this.configure();

//         this.attach();
//     }

//     private attach (){
//         this.hostElement.insertAdjacentElement('afterbegin', this.element) //after begin of openening Tag
//     }

//     private submitHandler(event: Event){
//         event.preventDefault(); //prevent default form submission, which would trigger an http request(?)
//         console.log(this.titleInputelement.value); // does not work without bind(this), because the method was bound to something, so the contex of this is not the class, but the current target of the event
//     }

//     private configure(){
//         //set up an eventlistener
//         //his.element.addEventListener('submit', this.submitHandler); //original simple example -> works, but this.titleInputelement will not be visible
//         this.element.addEventListener('submit', this.submitHandler.bind(this)); //here we are binging the current context (this) the context of the eventhandler
//     }
// }

// const pInput = new ProjectInput();