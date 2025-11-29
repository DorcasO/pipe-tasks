import { AppComponent } from './app';

describe('AppComponent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create an instance', () => {
    const component = new AppComponent();
    expect(component).toBeTruthy();
  });

  it('addTask should add a task when name and deadline are set', () => {
    const component = new AppComponent();
    component.taskName = 'Test task';
    component.deadline = '2025-12-31';
    component.count = 2;
    component.addTask();
    expect(component.tasks.length).toBeGreaterThan(0);
    expect(component.tasks[0].name).toBe('Test task');
  });

  it('deleteTask should remove a task by id', () => {
    const component = new AppComponent();
    component.taskName = 'Task to delete';
    component.deadline = '2025-12-31';
    component.addTask();
    const taskId = component.tasks[0].id;
    // Mock confirm to return true
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteTask(component.tasks[0]);
    expect(component.tasks.find(t => t.id === taskId)).toBeUndefined();
  });

  it('markDone should toggle task.done', () => {
    const component = new AppComponent();
    component.taskName = 'Task';
    component.deadline = '2025-12-31';
    component.addTask();
    const task = component.tasks[0];
    const initialDone = task.done;
    component.markDone(task);
    expect(task.done).toBe(!initialDone);
  });
});
