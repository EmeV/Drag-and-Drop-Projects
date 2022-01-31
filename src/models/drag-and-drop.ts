//Drag and Drop Interface
  export interface Draggable {
    dragStartHandler(event: DragEvent): void; //listener
    dragEndHandler(event: DragEvent): void; //listener
  }

  export interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void; //react to the drop itself -> use to update data here
    dragLeaveHandler(event: DragEvent): void; //if we want to give visual feedback, or revert visual handler, if drag was cancelled
  }
