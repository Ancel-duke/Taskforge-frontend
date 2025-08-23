export interface User {
  _id: string;
  username: string;
  name: string;
  avatar?: string;
  dateJoined: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate?: string;
  assignedTo?: User;
  createdBy: User;
  project: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: User;
  members: User[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  completionRate: number;
  tasksByPriority: {
    Low: number;
    Medium: number;
    High: number;
    Urgent: number;
  };
  tasksByStatus: {
    'To Do': number;
    'In Progress': number;
    'Done': number;
  };
  overdueTasks: number;
  recentTasks: number;
  totalTasks: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}

export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate?: string;
  assignedTo?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'To Do' | 'In Progress' | 'Done';
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate?: string;
  assignedTo?: string;
}

export interface UpdateProfileData {
  name?: string;
  avatar?: File;
}

export interface Invitation {
  _id: string;
  project: Project;
  inviter: User;
  invitee: User;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}
