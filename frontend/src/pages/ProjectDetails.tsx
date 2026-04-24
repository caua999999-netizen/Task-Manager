import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { projectsService } from '../services/projects';
import { Button } from '../components/Button';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Project, Task } from '../types';
import type { TaskFormData } from '../schemas/taskSchema';

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  const { tasks, isLoading, error, createTask, updateTask, deleteTask } = useTasks(id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function fetchProject() {
      try {
        const data = await projectsService.getById(id!);
        if (isMounted) {
          setProject(data);
          setProjectError(null);
        }
      } catch (err) {
        if (isMounted) {
          const message = err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
            : null;
          setProjectError(message || 'Erro ao carregar projeto');
        }
      } finally {
        if (isMounted) {
          setIsLoadingProject(false);
        }
      }
    }

    void fetchProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  function handleOpenCreateModal() {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function handleOpenEditModal(task: Task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingTask(null);
  }

  async function handleSubmitTask(data: TaskFormData) {
    if (!id) return;

    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask({ ...data, projectId: id });
    }
    handleCloseModal();
  }

  async function handleConfirmDelete() {
    if (!deletingTask) return;
    await deleteTask(deletingTask.id);
    setDeletingTask(null);
  }

  async function handleStatusChange(task: Task, newStatus: 'todo' | 'doing' | 'done') {
    await updateTask(task.id, { status: newStatus });
  }

  const filteredTasks = statusFilter === 'all'
    ? tasks
    : tasks.filter((t) => t.status === statusFilter);

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    doing: tasks.filter((t) => t.status === 'doing').length,
    done: tasks.filter((t) => t.status === 'done').length
  };

  if (isLoadingProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Carregando projeto...</p>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-xl shadow text-center max-w-md">
          <p className="text-red-600 mb-4">{projectError || 'Projeto não encontrado'}</p>
          <Button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.name}</span>
            <Button variant="secondary" onClick={logout}>Sair</Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-indigo-600 hover:text-indigo-700 mb-4 text-sm"
        >
          ← Voltar ao Dashboard
        </button>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h2>
          {project.description && (
            <p className="text-gray-600">{project.description}</p>
          )}

          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.todo}</div>
              <div className="text-xs text-gray-500">A fazer</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.doing}</div>
              <div className="text-xs text-gray-500">Em andamento</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.done}</div>
              <div className="text-xs text-gray-500">Concluídas</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-sm ${statusFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}
            >
              Todas
            </button>
            <button
              onClick={() => setStatusFilter('todo')}
              className={`px-3 py-1 rounded-lg text-sm ${statusFilter === 'todo' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}
            >
              A fazer
            </button>
            <button
              onClick={() => setStatusFilter('doing')}
              className={`px-3 py-1 rounded-lg text-sm ${statusFilter === 'doing' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}
            >
              Em andamento
            </button>
            <button
              onClick={() => setStatusFilter('done')}
              className={`px-3 py-1 rounded-lg text-sm ${statusFilter === 'done' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}
            >
              Concluídas
            </button>
          </div>
          <Button onClick={handleOpenCreateModal}>+ Nova Tarefa</Button>
        </div>

        {isLoading && (
          <div className="text-center py-12 text-gray-500">Carregando tarefas...</div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!isLoading && !error && filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">
              {statusFilter === 'all' ? 'Nenhuma tarefa ainda.' : 'Nenhuma tarefa nesse status.'}
            </p>
          </div>
        )}

        {!isLoading && !error && filteredTasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleOpenEditModal}
                onDelete={setDeletingTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        initialData={editingTask}
      />

      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        title="Deletar tarefa"
        message={`Tem certeza que deseja deletar "${deletingTask?.title}"?`}
      />
    </div>
  );
}