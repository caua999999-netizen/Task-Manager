import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../hooks/useProjects';
import { Button } from '../components/Button';
import { ProjectModal } from '../components/ProjectModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Project } from '../types';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { projects, isLoading, error, createProject, updateProject, deleteProject } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  function handleOpenCreateModal() {
    setEditingProject(null);
    setIsModalOpen(true);
  }

  function handleOpenEditModal(e: React.MouseEvent, project: Project) {
    e.stopPropagation();
    setEditingProject(project);
    setIsModalOpen(true);
  }

  function handleOpenDeleteDialog(e: React.MouseEvent, project: Project) {
    e.stopPropagation();
    setDeletingProject(project);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingProject(null);
  }

  async function handleSubmitProject(data: { name: string; description?: string }) {
    if (editingProject) {
      await updateProject(editingProject.id, data);
    } else {
      await createProject(data);
    }
    handleCloseModal();
  }

  async function handleConfirmDelete() {
    if (!deletingProject) return;
    await deleteProject(deletingProject.id);
    setDeletingProject(null);
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Meus Projetos</h2>
          <Button onClick={handleOpenCreateModal}>+ Novo Projeto</Button>
        </div>

        {isLoading && (
          <div className="text-center py-12 text-gray-500">Carregando projetos...</div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!isLoading && !error && projects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 mb-4">Você ainda não tem projetos.</p>
            <Button onClick={handleOpenCreateModal}>Criar meu primeiro projeto</Button>
          </div>
        )}

        {!isLoading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="secondary"
                    onClick={(e) => handleOpenEditModal(e, project)}
                    className="text-sm"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={(e) => handleOpenDeleteDialog(e, project)}
                    className="text-sm"
                  >
                    Deletar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProject}
        initialData={editingProject}
      />

      <ConfirmDialog
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleConfirmDelete}
        title="Deletar projeto"
        message={`Tem certeza que deseja deletar "${deletingProject?.name}"? Todas as tarefas serão deletadas também.`}
      />
    </div>
  );
}