
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Task, Column, Alarm, AppData } from './types';
import { COLUMNS, ClockIcon, PlusIcon, BellIcon } from './constants';
import TaskColumn from './components/TaskColumn';
import NotesPanel from './components/NotesPanel';
import CalendarPanel from './components/CalendarPanel';
import AlarmAlert from './components/AlarmAlert';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [activeTab, setActiveTab] = useState<'board' | 'notes' | 'calendar'>('board');
  const [triggeredAlarm, setTriggeredAlarm] = useState<Alarm | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem('chronos_v1');
    if (savedData) {
      const parsed: AppData = JSON.parse(savedData);
      setTasks(parsed.tasks || []);
      setNotes(parsed.notes || '');
      setAlarms(parsed.alarms || []);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    const data: AppData = { tasks, notes, alarms };
    localStorage.setItem('chronos_v1', JSON.stringify(data));
  }, [tasks, notes, alarms]);

  // Alarm Check Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTimeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
      const currentDateStr = now.toISOString().split('T')[0];

      alarms.forEach(alarm => {
        if (alarm.active && alarm.date === currentDateStr && alarm.time === currentTimeStr) {
          setTriggeredAlarm(alarm);
          // Deactivate alarm after trigger
          setAlarms(prev => prev.map(a => a.id === alarm.id ? { ...a, active: false } : a));
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [alarms]);

  const handleAddTask = (columnId: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      content: '',
      completed: false,
      columnId,
      createdAt: Date.now()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (id: string, content: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, content } : t));
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddAlarm = (date: string, time: string, title: string) => {
    const newAlarm: Alarm = {
      id: crypto.randomUUID(),
      title,
      time,
      date,
      active: true
    };
    setAlarms(prev => [...prev, newAlarm]);
  };

  const dismissAlarm = () => setTriggeredAlarm(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] text-[#1a1a1a]">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-[#e0e0e0] bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#1a1a1a] rounded">
             <ClockIcon className="text-[#1a1a1a]" />
          </div>
          <h1 className="text-sm font-semibold tracking-[0.2em] uppercase">Chronos</h1>
        </div>
        
        <nav className="flex items-center gap-6 text-[11px] font-medium tracking-widest uppercase">
          <button 
            onClick={() => setActiveTab('board')}
            className={`pb-1 border-b-2 transition-colors ${activeTab === 'board' ? 'border-[#1a1a1a] text-[#1a1a1a]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Quadro
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`pb-1 border-b-2 transition-colors ${activeTab === 'calendar' ? 'border-[#1a1a1a] text-[#1a1a1a]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Calendário
          </button>
          <button 
            onClick={() => setActiveTab('notes')}
            className={`pb-1 border-b-2 transition-colors ${activeTab === 'notes' ? 'border-[#1a1a1a] text-[#1a1a1a]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            Notas
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-hidden relative">
        {activeTab === 'board' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full max-w-[1200px] mx-auto">
            {COLUMNS.map(col => (
              <TaskColumn 
                key={col.id}
                column={col}
                tasks={tasks.filter(t => t.columnId === col.id)}
                onAdd={() => handleAddTask(col.id)}
                onUpdate={handleUpdateTask}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}

        {activeTab === 'calendar' && (
          <CalendarPanel 
            alarms={alarms} 
            onAddAlarm={handleAddAlarm} 
            onDeleteAlarm={(id) => setAlarms(prev => prev.filter(a => a.id !== id))}
          />
        )}

        {activeTab === 'notes' && (
          <NotesPanel 
            content={notes} 
            onChange={setNotes} 
          />
        )}
      </main>

      {/* Footer / Status */}
      <footer className="h-10 border-t border-[#e0e0e0] bg-white flex items-center justify-between px-8 text-[10px] text-gray-400 font-medium tracking-widest uppercase">
        <div>Chronos Productive System v1.0</div>
        <div>{new Date().toLocaleDateString('pt-BR')}</div>
      </footer>

      {triggeredAlarm && (
        <AlarmAlert alarm={triggeredAlarm} onDismiss={dismissAlarm} />
      )}
    </div>
  );
};

export default App;
