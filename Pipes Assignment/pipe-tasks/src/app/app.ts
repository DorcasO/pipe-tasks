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
