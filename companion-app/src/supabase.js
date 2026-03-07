// Supabase client for direct API access
const SUPABASE_URL = 'https://pvavybczlrhwagasriwu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2YXZ5YmN6bHJod2FnYXNyaXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMzUyMzIsImV4cCI6MjA3MDgxMTIzMn0.Y0vL36TCuE8QYFpEbVBKzLYazowtYneUpOkSTk3RkZg';

export const fetchTasks = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/lifeos_tasks?select=*&order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const tasks = await res.json();
    const active = tasks.filter(t => t.status !== 'completed');
    const completed = tasks.filter(t => t.status === 'completed');
    return { active, completed };
  } catch (e) {
    console.error('Tasks fetch error:', e);
    return { active: [], completed: [] };
  }
};

export const createTask = async (title) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/lifeos_tasks`, {
      method: 'POST',
      headers: { 
        apikey: SUPABASE_KEY, 
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ title, status: 'pending', created_at: new Date().toISOString() })
    });
    return true;
  } catch (e) { return false; }
};

export const updateTask = async (id, updates) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/lifeos_tasks?id=eq.${id}`, {
      method: 'PATCH',
      headers: { 
        apikey: SUPABASE_KEY, 
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() })
    });
    return true;
  } catch (e) { return false; }
};

export const deleteTask = async (id) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/lifeos_tasks?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return true;
  } catch (e) { return false; }
};

export const fetchCortex = async (limit = 20) => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/lifeos_cortex?select=*&order=created_at.desc&limit=${limit}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return await res.json();
  } catch (e) {
    console.error('Cortex fetch error:', e);
    return [];
  }
};

export const createCortexEntry = async (title, content, section = 'all_spark', category = 'idea') => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/lifeos_cortex`, {
      method: 'POST',
      headers: { 
        apikey: SUPABASE_KEY, 
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ title, content, section, category, status: 'active' })
    });
    return true;
  } catch (e) { return false; }
};

export const fetchCalendar = async () => {
  // Return sample calendar data for now - can connect to Google Calendar later
  return { events: [] };
};
