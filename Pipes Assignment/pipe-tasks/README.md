# PipeTasks 🐸

A modern Angular task management application with filtering, status tracking, and queue management. Built with Angular 21, TypeScript, and featuring animations, localStorage persistence, and comprehensive unit tests.

## Features

✨ **Task Management**
- ➕ Create tasks with name, deadline, and count
- ✏️ Edit existing tasks
- 🗑️ Delete tasks with confirmation
- ✅ Mark tasks as done/pending
- 🔄 Toggle queued status (Add/Remove from queue)

📊 **Filtering & Search**
- 🔍 Search tasks by name (real-time)
- 📋 Filter by status (All, Done, Pending)
- 🎯 Combine search and status filters

💾 **Data Persistence**
- 🗃️ LocalStorage persistence (survives page refresh)
- 📦 JSON serialization with TypeScript typing
- 🚀 5 pre-loaded sample tasks on first load

🎨 **UI/UX**
- ✨ Smooth fade-in animations for new rows
- 📱 Responsive table layout
- 🎯 Clear action buttons (Edit, Delete, Mark Done, Add/Remove)
- 🐸 Frog status indicator (Pending/Done)

🧪 **Testing**
- 4 passing Jasmine unit tests
- Karma/Chrome Headless test runner
- Component instance testing with localStorage mocking

---

## Project Structure

```
src/
├── app/
│   ├── app.ts                 # Main component (116 lines)
│   ├── app.html               # Template with table & filters
│   ├── app.css                # Styling
│   ├── app.config.ts          # Application config (providers)
│   ├── app.spec.ts            # Unit tests (4 tests)
│   ├── priorityColor.pipe.ts  # Custom color pipe
│   ├── taskFilter.pipe.ts     # Task filtering pipe
│   └── timeRemaining.pipe.ts  # Deadline countdown pipe
├── main.ts                    # App bootstrap
├── test.ts                    # Test environment setup
├── styles.css                 # Global styles
└── index.html                 # HTML template

karma.conf.js                  # Karma test runner config
angular.json                   # Angular workspace config
tsconfig.spec.json             # Test TypeScript config
```

---

## Key Code Examples

### Task Interface

```typescript
interface Task {
  id: number;
  name: string;
  deadline: string;
  count: number;
  done: boolean;
  queued?: boolean;  // Optional: queued / not queued
}
```

### Component Methods

**Add Task**
```typescript
addTask() {
  if (!this.taskName || !this.deadline) return;
  const newTask: Task = {
    id: Date.now(),
    name: this.taskName,
    deadline: this.deadline,
    count: this.count || 0,
    done: false,
    queued: false
  };
  this.tasks.push(newTask);
  this.saveTasks();
  this.resetForm();
}
```

**Filter Tasks**
```typescript
get filteredTasks(): Task[] {
  return this.tasks.filter(t => {
    const matchesName = t.name.toLowerCase().includes(this.taskName.toLowerCase());
    const matchesStatus = this.statusFilter === 'all'
      || (this.statusFilter === 'done' && t.done)
      || (this.statusFilter === 'pending' && !t.done);
    return matchesName && matchesStatus;
  });
}
```

**Mark Done**
```typescript
markDone(task: Task) {
  task.done = !task.done;
  this.saveTasks();
}
```

**Toggle Queued (ngSwitch Demo)**
```typescript
toggleQueued(task: Task) {
  task.queued = !task.queued;
  this.saveTasks();
}
```

**Data Persistence**
```typescript
private saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(this.tasks));
}

private loadTasks() {
  const raw = localStorage.getItem('tasks');
  this.tasks = raw ? (JSON.parse(raw) as Task[]) : [];
}
```

### Sample Tasks

```typescript
// 5 pre-loaded tasks on first load
{
  id: 1,
  name: 'Design database schema',
  deadline: '2025-12-05',
  count: 3,
  done: false,
  queued: true
},
{
  id: 2,
  name: 'Setup authentication',
  deadline: '2025-12-10',
  count: 5,
  done: true,
  queued: false
},
// ... 3 more tasks
```

### Unit Tests (Jasmine)

```typescript
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
```

---

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/DorcasO/pipe-tasks.git
cd pipe-tasks

# Install dependencies
npm install
```

### Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/` (or the fallback port shown in the terminal). The app will auto-reload on file changes.

### Running Tests

```bash
# Run tests once (headless Chrome)
npm test -- --watch=false

# Run tests in watch mode
npm test
```

**Test Results:** ✅ 4 tests passing

```
Chrome Headless: Executed 4 of 4 SUCCESS
TOTAL: 4 SUCCESS
```

### Build for Production

```bash
npm run build
```

Output will be in `dist/pipe-tasks/` (235.72 kB gzipped).

---

## UI Walkthrough

### Main Table
| Column | Description |
|--------|-------------|
| **ID** | Unique task identifier (timestamp) |
| **Task name** | Title of the task |
| **Deadline** | Due date (YYYY-MM-DD format) |
| **Count** | Quantity/subtasks counter |
| **Status** | 🐸 Pending or ✓ Done |
| **Queued** | Add/Remove button (ngSwitch demo) |
| **Actions** | Edit, Delete, Mark Done/Undo |

### Sample Task Row
```
ID: 1 | Design database schema | 2025-12-05 | 3 | 🐸 Pending | [Remove] | [Edit] [Delete] [Mark Done]
```

### Filters
- **Search Bar:** "Design" → Shows only "Design database schema"
- **Status Filter:** "Done" → Shows only completed tasks
- **Combined:** Search "auth" + Status "Done" → Filters by both criteria

---

## Architecture & Patterns

### Standalone Component
```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  animations: [trigger('fadeInRow', [...])]
})
export class AppComponent { ... }
```

**No NgModules required!** Angular 21 uses standalone components with provider-based setup via `app.config.ts`.

### Animations
```typescript
animations: [
  trigger('fadeInRow', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(-10px)' }),
      animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ])
  ])
]
```

Smooth fade-in when new rows are added to the table.

### Two-Way Binding
```html
<input type="text" [(ngModel)]="taskName" placeholder="Task name" />
<select [(ngModel)]="statusFilter">
  <option value="all">Status: All</option>
  <option value="done">Done</option>
  <option value="pending">Pending</option>
</select>
```

### Structural Directives
```html
<!-- List rendering with animation -->
<tr *ngFor="let task of filteredTasks" [@fadeInRow]>
  ...
</tr>

<!-- Conditional status display -->
<span [ngClass]="task.done ? 'done' : 'pending'">
  🐸 {{ task.done ? 'Done' : 'Pending' }}
</span>

<!-- Switch demo (queued status) -->
<div [ngSwitch]="task.queued">
  <button *ngSwitchCase="false" (click)="toggleQueued(task)">Add</button>
  <button *ngSwitchCase="true" (click)="toggleQueued(task)">Remove</button>
</div>
```

---

## Fixes Applied

### 1. Template Error
**Issue:** Malformed `<tr>` with premature closing tag
```html
<!-- Before (❌ broken) -->
<tr *ngFor="let task of filteredTasks" [@fadeInRow]></tr>
    [class.done-row]="task.done"
    [@fadeInRow]>

<!-- After (✅ fixed) -->
<tr *ngFor="let task of filteredTasks" [class.done-row]="task.done" [@fadeInRow]>
```

### 2. BrowserAnimationsModule Import
**Issue:** NgModule incorrectly imported in standalone component
```typescript
// Before (❌ broken)
imports: [CommonModule, FormsModule, BrowserAnimationsModule]

// After (✅ fixed)
imports: [CommonModule, FormsModule]
// Animations enabled globally via provideAnimations() in app.config.ts
```

### 3. TypeScript Type Safety
**Issue:** `JSON.parse()` untyped
```typescript
// Before (❌ any type)
this.tasks = raw ? JSON.parse(raw) : [];

// After (✅ typed)
this.tasks = raw ? (JSON.parse(raw) as Task[]) : [];
```

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 21.0.0 | Frontend framework |
| **TypeScript** | 5.9.2 | Language |
| **RxJS** | 7.8.0 | Reactive utilities |
| **Karma** | 6.4.4 | Test runner |
| **Jasmine** | - | Testing framework |
| **Vite** | - | Dev server/bundler |

---

## Git Commits

```
32b48ab - Remove BrowserAnimationsModule from imports, add provideAnimations, and add 5 sample tasks
bc226a0 - Add Karma/Jasmine test setup with 4 passing unit tests for AppComponent
ccb63a2 - Fix template <tr> and add BrowserAnimationsModule; type parsed tasks
```

---

## Future Enhancements

- 📅 Add deadline countdown pipe (timeRemaining.pipe.ts)
- 🎨 Use priority color pipe (priorityColor.pipe.ts)
- 📊 Add task analytics (completed %, upcoming deadlines)
- 🔐 Backend API integration
- ☁️ Cloud sync (Firebase, Supabase)
- 📱 Mobile-responsive improvements
- 🌙 Dark mode toggle

---

## License

Open source - feel free to use and modify!

---

## Author

Created by **Dorcas Ojo** for Angular practice and assignment submission.

**Repository:** https://github.com/DorcasO/pipe-tasks

---

## Support

Need help? Open an issue on GitHub or check the Angular documentation at https://angular.dev


For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
