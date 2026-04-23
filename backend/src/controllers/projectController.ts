import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { createProjectSchema, updateProjectSchema } from '../schemas/projectSchema';

export async function createProject(req: Request, res: Response) {
  try {
    const data = createProjectSchema.parse(req.body);
    const userId = req.userId!;

    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: userId
      }
    });

    return res.status(201).json(project);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function listProjects(req: Request, res: Response) {
  try {
    const userId = req.userId!;

    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function getProjectById(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const userId = req.userId!;

    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (project.ownerId !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para acessar este projeto' });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const userId = req.userId!;
    const data = updateProjectSchema.parse(req.body);

    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (project.ownerId !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para editar este projeto' });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data
    });

    return res.status(200).json(updatedProject);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const userId = req.userId!;

    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (project.ownerId !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para deletar este projeto' });
    }

    await prisma.project.delete({
      where: { id }
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}