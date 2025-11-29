# PipeTasks - Code Examples & Implementation Guide

## Full Component Code

### app.ts (Main Component - 116 lines)

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';

interface Task {
  id: number;
  name: string;
  deadline: string;
  count: number;
  done: boolean;
  queued?: boolean;  // for ngSwitch demo: queued / not queued
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  animations: [  // ✅ Don't comment out this block!
    trigger('fadeInRow', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AppComponent {
  taskName = '';
  deadline = '';
  count: number | null = null;
  statusFilter: 'all' | 'done' | 'pending' = 'all';

  tasks: Task[] = [];

  constructor() {
    this.loadTasks();
    // Load sample tasks if localStorage is empty
    if (this.tasks.length === 0) {
      this.tasks = [
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
        {
          id: 3,
          name: 'Build API endpoints',
          deadline: '2025-12-15',
          count: 8,
          done: false,
          queued: false
        },
        {
          id: 4,
          name: 'Write unit tests',
          deadline: '2025-12-08',
          count: 12,
          done: false,
          queued: true
        },
        {
          id: 5,
          name: 'Deploy to production',
          deadline: '2025-12-20',
          count: 2,
          done: false,
          queued: false
        }
      ];
      this.saveTasks();
    }
  }

  get filteredTasks(): Task[] {
    return this.tasks.filter(t => {
      const matchesName = t.name.toLowerCase().includes(this.taskName.toLowerCase());
      const matchesStatus = this.statusFilter === 'all'
        || (this.statusFilter === 'done' && t.done)
        || (this.statusFilter === 'pending' && !t.done);
      return matchesName && matchesStatus;
    });
  }

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

  deleteTask(task: Task) {
    if (!confirm(`Are you sure you want to delete "${task.name}"?`)) return;
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasks();
  }

  editTask(task: Task) {
    if (!confirm(`Edit "${task.name}"? This will remove and prefill.`)) return;
    this.taskName = task.name;
    this.deadline = task.deadline;
    this.count = task.count;
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasks();
  }

  markDone(task: Task) {
    task.done = !task.done;
    this.saveTasks();
  }

  toggleQueued(task: Task) {
    task.queued = !task.queued;
    this.saveTasks();
  }

  clearAll() {
    if (!confirm('Clear all tasks?')) return;
    this.tasks = [];
    localStorage.removeItem('tasks');
  }

  private resetForm() {
    this.taskName = '';
    this.deadline = '';
    this.count = null;
  }

  private saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  private loadTasks() {
    const raw = localStorage.getItem('tasks');
    this.tasks = raw ? (JSON.parse(raw) as Task[]) : [];
  }
}
```

---

## Template Code (Partial - Key Sections)

### Filter Section

```html
<div class="filter-row">
  <!-- Search by task name -->
  <input 
    type="text" 
    [(ngModel)]="taskName" 
    placeholder="Search tasks by name..." />
  
  <!-- Filter by status -->
  <select [(ngModel)]="statusFilter">
    <option value="all">Status: All</option>
    <option value="done">Done</option>
    <option value="pending">Pending</option>
  </select>
  
  <!-- Form inputs for new task -->
  <input 
    type="text" 
    [(ngModel)]="taskName" 
    placeholder="Task name" />
  <input 
    type="date" 
    [(ngModel)]="deadline" />
  <input 
    type="number" 
    [(ngModel)]="count" 
    placeholder="0" />
  
  <!-- Action buttons -->
  <button class="btn-primary" (click)="addTask()">Add Task</button>
  <button class="btn-secondary" (click)="clearAll()">Clear All</button>
</div>
```

### Table with Data Binding

```html
<table class="tasks-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Task name</th>
      <th>Deadline</th>
      <th>Count</th>
      <th>Status (Frog)</th>
      <th>Queued</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <!-- Loop through filtered tasks with animation -->
    <tr 
      *ngFor="let task of filteredTasks" 
      [class.done-row]="task.done" 
      [@fadeInRow]>
      
      <!-- Display task ID -->
      <td>{{ task.id }}</td>
      
      <!-- Display task name -->
      <td>{{ task.name }}</td>
      
      <!-- Display deadline -->
      <td>{{ task.deadline }}</td>
      
      <!-- Display count -->
      <td>{{ task.count }}</td>
      
      <!-- Status with conditional styling -->
      <td>
        <span class="status" [ngClass]="task.done ? 'done' : 'pending'">
          🐸 {{ task.done ? 'Done' : 'Pending' }}
        </span>
      </td>
      
      <!-- Queued toggle (ngSwitch demo) -->
      <td>
        <div [ngSwitch]="task.queued">
          <button 
            *ngSwitchCase="false" 
            class="btn-primary" 
            (click)="toggleQueued(task)">
            Add
          </button>
          <button 
            *ngSwitchCase="true" 
            class="btn-danger" 
            (click)="toggleQueued(task)">
            Remove
          </button>
        </div>
      </td>
      
      <!-- Action buttons -->
      <td class="actions-cell">
        <button 
          class="btn-secondary" 
          (click)="editTask(task)">
          Edit
        </button>
        <button 
          class="btn-danger" 
          (click)="deleteTask(task)">
          Delete
        </button>
        <button 
          class="btn-primary" 
          (click)="markDone(task)">
          {{ task.done ? 'Undo' : 'Mark Done' }}
        </button>
      </td>
    </tr>
  </tbody>
</table>

<!-- Footer with count -->
<div class="footer">Total tasks: {{ filteredTasks.length }}</div>
```

---

## Application Config

### app.config.ts

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations()  // Enables animations globally
  ]
};
```

### main.ts (Bootstrap)

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

---

## Unit Tests

### app.spec.ts (4 Tests)

```typescript
import { AppComponent } from './app';

describe('AppComponent', () => {
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  // Test 1: Component instantiation
  it('should create an instance', () => {
    const component = new AppComponent();
    expect(component).toBeTruthy();
  });

  // Test 2: Add task functionality
  it('addTask should add a task when name and deadline are set', () => {
    const component = new AppComponent();
    
    // Set form values
    component.taskName = 'Test task';
    component.deadline = '2025-12-31';
    component.count = 2;
    
    // Call addTask
    component.addTask();
    
    // Assertions
    expect(component.tasks.length).toBeGreaterThan(0);
    expect(component.tasks[0].name).toBe('Test task');
  });

  // Test 3: Delete task functionality
  it('deleteTask should remove a task by id', () => {
    const component = new AppComponent();
    
    // Create task
    component.taskName = 'Task to delete';
    component.deadline = '2025-12-31';
    component.addTask();
    
    // Get task ID
    const taskId = component.tasks[0].id;
    
    // Mock confirm dialog
    spyOn(window, 'confirm').and.returnValue(true);
    
    // Delete task
    component.deleteTask(component.tasks[0]);
    
    // Assert task is removed
    expect(component.tasks.find(t => t.id === taskId)).toBeUndefined();
  });

  // Test 4: Mark done toggle
  it('markDone should toggle task.done', () => {
    const component = new AppComponent();
    
    // Create task
    component.taskName = 'Task';
    component.deadline = '2025-12-31';
    component.addTask();
    
    // Get task reference
    const task = component.tasks[0];
    const initialDone = task.done;
    
    // Toggle done
    component.markDone(task);
    
    // Assert toggle
    expect(task.done).toBe(!initialDone);
  });
});
```

---

## Filtering Logic Explained

### Basic Filter

```typescript
// Search by name
const matchesName = t.name.toLowerCase()
  .includes(this.taskName.toLowerCase());
```

**Example:**
```
taskName = "auth"
"Setup authentication".toLowerCase().includes("auth") → true ✓
"Design database schema".toLowerCase().includes("auth") → false ✗
```

### Status Filter

```typescript
// Filter by status
const matchesStatus = this.statusFilter === 'all'
  || (this.statusFilter === 'done' && t.done)
  || (this.statusFilter === 'pending' && !t.done);
```

**Truth Table:**
```
statusFilter = 'all'     → always true (show all)
statusFilter = 'done'    → show if t.done === true
statusFilter = 'pending' → show if t.done === false
```

### Combined Filter (AND Logic)

```typescript
return matchesName && matchesStatus;
```

**Example:**
```
Search: "auth"
Status: "done"

Task 1: Setup authentication
├─ matchesName: "Setup authentication".includes("auth") → true
├─ matchesStatus: statusFilter === 'done' && done === true → true
└─ Result: true && true → SHOW ✓

Task 2: Design database schema
├─ matchesName: "Design database schema".includes("auth") → false
├─ matchesStatus: statusFilter === 'done' && done === true → true
└─ Result: false && true → HIDE ✗

Task 3: Build API endpoints
├─ matchesName: "Build API endpoints".includes("auth") → false
├─ matchesStatus: statusFilter === 'done' && done === false → false
└─ Result: false && false → HIDE ✗
```

---

## Data Persistence Pattern

### Save to localStorage

```typescript
private saveTasks() {
  // Serialize tasks array to JSON string
  const json = JSON.stringify(this.tasks);
  
  // Store in browser localStorage
  localStorage.setItem('tasks', json);
  
  // Browser remembers even after refresh!
}
```

### Load from localStorage

```typescript
private loadTasks() {
  // Retrieve JSON string from localStorage
  const raw = localStorage.getItem('tasks');
  
  // Parse and type-cast to Task[]
  this.tasks = raw ? (JSON.parse(raw) as Task[]) : [];
  
  // If no data, initialize empty array
}
```

### localStorage Schema

```json
{
  "tasks": [
    {
      "id": 1234567890,
      "name": "Design database schema",
      "deadline": "2025-12-05",
      "count": 3,
      "done": false,
      "queued": true
    },
    {
      "id": 1234567891,
      "name": "Setup authentication",
      "deadline": "2025-12-10",
      "count": 5,
      "done": true,
      "queued": false
    }
  ]
}
```

---

## Angular Directives Used

### *ngFor - List Rendering

```html
<!-- Loop through filtered tasks -->
<tr *ngFor="let task of filteredTasks">
  <td>{{ task.name }}</td>
</tr>

<!-- With index -->
<tr *ngFor="let task of filteredTasks; let i = index">
  <td>#{{ i + 1 }}</td>
</tr>
```

### *ngIf - Conditional Rendering

```html
<!-- Show only if task.done is true -->
<button *ngIf="task.done" (click)="markDone(task)">Undo</button>

<!-- Show only if task.done is false -->
<button *ngIf="!task.done" (click)="markDone(task)">Mark Done</button>
```

### [ngClass] - Dynamic Styling

```html
<!-- Apply class based on condition -->
<tr [class.done-row]="task.done">
  ...
</tr>

<!-- Multiple classes -->
<div [ngClass]="{ 'active': task.done, 'pending': !task.done }">
  ...
</div>

<!-- From component property -->
<span [ngClass]="task.done ? 'done' : 'pending'">
  {{ task.done ? 'Done' : 'Pending' }}
</span>
```

### [ngSwitch] - Multi-branch Conditional

```html
<!-- Switch on task.queued property -->
<div [ngSwitch]="task.queued">
  <!-- Case: not queued -->
  <button *ngSwitchCase="false" (click)="toggleQueued(task)">
    Add to Queue
  </button>
  
  <!-- Case: queued -->
  <button *ngSwitchCase="true" (click)="toggleQueued(task)">
    Remove from Queue
  </button>
  
  <!-- Default case (optional) -->
  <button *ngSwitchDefault>
    Unknown State
  </button>
</div>
```

---

## Two-Way Data Binding

### [(ngModel)] Pattern

```html
<!-- Single input -->
<input [(ngModel)]="taskName" placeholder="Task name" />

<!-- Multi-part form -->
<input type="text" [(ngModel)]="taskName" />
<input type="date" [(ngModel)]="deadline" />
<input type="number" [(ngModel)]="count" />
```

**How it works:**
```
User types "Design" → [(ngModel)] → taskName = "Design"
taskName changes → [(ngModel)] → Input shows "Design"
(Two-way synchronization)
```

---

## Event Binding

### Click Events

```html
<!-- Simple click -->
<button (click)="addTask()">Add Task</button>

<!-- With parameter -->
<button (click)="deleteTask(task)">Delete</button>

<!-- With confirmation -->
<button (click)="markDone(task)">
  {{ task.done ? 'Undo' : 'Mark Done' }}
</button>
```

---

## Property Binding

### Property Binding Examples

```html
<!-- Class binding -->
<tr [class.done-row]="task.done">

<!-- Attribute binding -->
<img [src]="imageUrl" />
<input [value]="taskName" />

<!-- Disabled state -->
<button [disabled]="taskName === ''">Add</button>

<!-- Style binding -->
<div [style.color]="task.done ? 'green' : 'red'">
  {{ task.name }}
</div>
```

---

## String Interpolation

```html
<!-- Display variable -->
<td>{{ task.name }}</td>

<!-- Simple expression -->
<td>{{ task.count + 1 }}</td>

<!-- Ternary operator -->
<span>{{ task.done ? '✓ Done' : '🐸 Pending' }}</span>

<!-- Method call -->
<td>{{ getTaskStatus(task) }}</td>

<!-- Property access -->
<td>{{ task.deadline }}</td>
```

---

## Animation Configuration

```typescript
animations: [
  trigger('fadeInRow', [
    // Trigger on new element entry
    transition(':enter', [
      // Initial state (before animation)
      style({ 
        opacity: 0, 
        transform: 'translateY(-10px)' 
      }),
      
      // Animation (duration, timing, final state)
      animate('300ms ease-out', style({ 
        opacity: 1, 
        transform: 'translateY(0)' 
      }))
    ])
  ])
]
```

**Timeline:**
```
Time:    0ms          150ms        300ms
State:   [Initial]────[50%]────────[Final]
Opacity: 0            0.5          1
Y:       -10px        -5px         0px
```

---

## Key TypeScript Patterns

### Type Assertion

```typescript
// Cast to specific type
this.tasks = raw ? (JSON.parse(raw) as Task[]) : [];
```

### Union Types

```typescript
statusFilter: 'all' | 'done' | 'pending' = 'all';
count: number | null = null;
```

### Optional Properties

```typescript
interface Task {
  id: number;
  name: string;
  queued?: boolean;  // Optional (can be undefined)
}
```

### Arrow Functions

```typescript
this.tasks.filter(t => {
  // Filter logic
  return matchesCondition;
});
```

### Ternary Operator

```typescript
{{ task.done ? 'Done' : 'Pending' }}

// In TypeScript
const status = task.done ? 'Completed' : 'In Progress';
```

---

## Git Commit History

```
32b48ab - Remove BrowserAnimationsModule from imports, add provideAnimations, and add 5 sample tasks
bc226a0 - Add Karma/Jasmine test setup with 4 passing unit tests for AppComponent
ccb63a2 - Fix template <tr> and add BrowserAnimationsModule; type parsed tasks
```

---

## Common Debugging Tips

### Check localStorage

```javascript
// In browser console
console.log(JSON.parse(localStorage.getItem('tasks')));

// Clear all data
localStorage.clear();
```

### Angular DevTools

```
1. Install Angular DevTools browser extension
2. Open DevTools (F12)
3. Click "Angular" tab
4. Inspect component properties
5. Check change detection
```

### Template Syntax Errors

```
❌ [ngClass]="task.done"     // Wrong: need object
✅ [ngClass]="{ done: task.done }"

❌ *ngIf="task"              // Always true
✅ *ngIf="task.done"         // Conditional

❌ [(ngModel)]="taskName"    // Outside form
✅ FormsModule imported first
```

---

Generated: November 29, 2025
