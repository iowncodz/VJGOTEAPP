import { User, Task, Instruction, AttendanceRecord, SalaryRecord } from '../types';

const STORAGE_KEY = 'vjgote_cloud_db_v2';

class CloudDatabase {
  private data: any;
  private listeners: Set<() => void> = new Set();

  constructor() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      
      this.data = {
        users: parsed?.users || [],
        tasks: parsed?.tasks || [],
        instructions: parsed?.instructions || [],
        attendance: parsed?.attendance || [],
        salaries: parsed?.salaries || []
      };
    } catch (e) {
      console.error("DB Init Error, resetting to defaults", e);
      this.data = {
        users: [],
        tasks: [],
        instructions: [],
        attendance: [],
        salaries: []
      };
    }
  }

  private async simulateNetworkDelay() {
    return new Promise(resolve => setTimeout(resolve, 50));
  }

  private async sync() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    this.listeners.forEach(l => {
      try {
        l();
      } catch (e) {
        console.error("Listener error", e);
      }
    });
  }

  onSnapshot(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  async collection<K extends keyof typeof this.data>(name: K): Promise<any[]> {
    await this.simulateNetworkDelay();
    return Array.isArray(this.data[name]) ? this.data[name] : [];
  }

  async add<K extends keyof typeof this.data>(name: K, item: any) {
    await this.simulateNetworkDelay();
    if (!Array.isArray(this.data[name])) this.data[name] = [];
    this.data[name].unshift(item);
    await this.sync();
    return item;
  }

  async delete<K extends keyof typeof this.data>(name: K, id: string, idField: string = 'id') {
    await this.simulateNetworkDelay();
    if (Array.isArray(this.data[name])) {
      this.data[name] = this.data[name].filter((item: any) => item[idField] !== id);
      await this.sync();
    }
  }

  async update<K extends keyof typeof this.data>(name: K, id: string, updates: any, idField: string = 'id') {
    await this.simulateNetworkDelay();
    if (Array.isArray(this.data[name])) {
      this.data[name] = this.data[name].map((item: any) => 
        (item[idField] === id) ? { ...item, ...updates } : item
      );
      await this.sync();
    }
  }

  async setCollection<K extends keyof typeof this.data>(name: K, newData: any[]) {
    await this.simulateNetworkDelay();
    this.data[name] = Array.isArray(newData) ? newData : [];
    await this.sync();
  }
}

export const db = new CloudDatabase();