import Dexie, { type Table } from 'dexie';

export interface Subject {
  id?: number;
  title: string;
  dateCreated: Date;
}

export interface Note {
  id?: number;
  subjectId: number;
  title: string;
  content: string; // markdown
  dateCreated: string;
  dateUpdated: string;
}

export interface Task {
  id?: number;
  subjectId: number;
  title: string;
  description: string; // markdown
  completed: boolean;
  dateCompleted?: Date;
  dateCreated: Date;
  dateUpdated: Date;
}

// Reminders are shown in the bottom of the screen in a drawer
export interface Reminder {
  id?: number;
  title: string;
  description: string;
  dateCreated: Date;
  dateUpdated: Date;
}

export class DexieDB extends Dexie {
  // 'subjects' (and the others) is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  subjects!: Table<Subject>; 
  notes!: Table<Note>;
  tasks!: Table<Task>;
  reminders!: Table<Reminder>;

  constructor() {
    super('myDatabase');
    this.version(2).stores({
      subjects: '++id, title, dateCreated', // Primary key and indexed props
      notes: '++id, subjectId, title, content, dateCreated, dateUpdated',
      tasks: '++id, subjectId, title, description, completed, dateCompleted, dateCreated, dateUpdated',
      reminders: '++id, title, description, dateCreated, dateUpdated'
    });
  }
}

export const db = new DexieDB();

