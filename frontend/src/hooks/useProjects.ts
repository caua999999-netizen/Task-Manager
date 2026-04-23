import { useState, useEffect, useRef } from 'react';
import { projectsService } from '../services/projects';
import type { CreateProjectData, UpdateProjectData } from '../services/projects';
import type { Project } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadFlag, setReloadFlag] = useState(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    async function fetchProjects() {
      try {
        const data = await projectsService.list();
        if (isMountedRef.current) {
          setProjects(data);
          setError(null);
        }
      } catch (err) {
        if (isMountedRef.current) {
          const message = err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
            : null;
          setError(message || 'Erro ao carregar projetos');
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    }

    void fetchProjects();

    return () => {
      isMountedRef.current = false;
    };
  }, [reloadFlag]);

  async function createProject(data: CreateProjectData) {
    const newProject = await projectsService.create(data);
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  }

  async function updateProject(id: string, data: UpdateProjectData) {
    const updated = await projectsService.update(id, data);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }

  async function deleteProject(id: string) {
    await projectsService.delete(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  function reload() {
    setIsLoading(true);
    setReloadFlag((prev) => prev + 1);
  }

  return {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
    reload
  };
}