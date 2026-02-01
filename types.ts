
export interface Task {
  id: string;
  content: string;
  completed: boolean;
  columnId: string;
  createdAt: number;
}

export interface Column {
  id: string;
  title: string;
}

export interface Alarm {
  id: string;
  title: string;
  time: string; // ISO format or HH:mm
  date: string; // YYYY-MM-DD
  active: boolean;
}

export interface AppData {
  tasks: Task[];
  notes: string;
  alarms: Alarm[];
}
