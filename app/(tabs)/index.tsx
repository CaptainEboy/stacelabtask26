import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { getAllTasks, addTask, updateTask, deleteTask, Task, initializeDatabase } from '@/lib/db';
import { CircleCheck as CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react-native';

type FilterType = 'all' | 'active' | 'completed';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      await initializeDatabase();
      setError(null);
      const loadedTasks = await getAllTasks();
      setTasks(loadedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function addNewTask() {
    const trimmedTitle = newTaskTitle.trim();
    if (!trimmedTitle) {
      setError('Task title cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const newTask = await addTask(trimmedTitle);
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleTask(task: Task) {
    try {
      setError(null);
      await updateTask(task.id, !task.completed);
      setTasks(
        tasks.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  }

  async function removeTask(taskId: string) {
    try {
      setError(null);
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Stacelabs Task Tracker</Text>
        <Text style={styles.subtitle}>
          {activeCount} active · {completedCount} completed
        </Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          placeholder="What needs to be done?"
          placeholderTextColor="#9ca3af"
          onSubmitEditing={addNewTask}
          editable={!submitting}
        />
        <TouchableOpacity
          style={[styles.addButton, submitting && styles.addButtonDisabled]}
          onPress={addNewTask}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Plus color="#fff" size={24} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All ({tasks.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
          onPress={() => setFilter('active')}
        >
          <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
            Active ({activeCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
            Completed ({completedCount})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity
              style={styles.taskContent}
              onPress={() => toggleTask(item)}
            >
              {item.completed ? (
                <CheckCircle2 color="#10b981" size={24} />
              ) : (
                <Circle color="#6b7280" size={24} />
              )}
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.taskTextCompleted,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeTask(item.id)}
            >
              <Trash2 color="#ef4444" size={20} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filter === 'all' && 'No tasks yet. Add one to get started!'}
              {filter === 'active' && 'No active tasks. Great job!'}
              {filter === 'completed' && 'No completed tasks yet.'}
            </Text>
          </View>
        }
        contentContainerStyle={filteredTasks.length === 0 && styles.emptyList}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#fff',
  },
  taskItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  taskTextCompleted: {
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  emptyList: {
    flexGrow: 1,
  },
});
