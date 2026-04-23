import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import {
  createTaskSchema,
  updateTaskSchema,
  listTasksQuerySchema
} from '../schemas/taskSchema';

export async function createTask(req: Request, res: Response) {
  try {
    const data = createTaskSchema.parse(req.body);
    const userId = req.userId!;

    const project = await prisma.project.findUnique({
      where: { id: data.projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (project.ownerId !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para criar tarefas neste projeto' });
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        projectId: data.projectId,
        creatorId: userId
      }
    });

    return res.status(201).json(task);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function listTasks(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const query = listTasksQuerySchema.parse(req.query);

    const userProjects = await prisma.project.findMany({
      where: { ownerId: userId },
      select: { id: true }
    });
    const userProjectIds = userProjects.map(p => p.id);

    const tasks = await prisma.task.findMany({
      where: {
        projectId: query.projectId
          ? (userProjectIds.includes(query.projectId) ? query.projectId : '__no_match__')
          : { in: userProjectIds },
        status: query.status,
        priority: query.priority
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(tasks);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function getTaskById(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const userId = req.userId!;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    if (task.project.ownerId !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para acessar esta tarefa' });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function updateTask(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const userId = req.userId!;
    const data = updateTaskSchema.parse(req.body);

    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    if (task.project.ownerId !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para editar esta tarefa' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data
    });

    return res.status(200).json(updatedTask);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const userId = req.userId!;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    if (task.project.ownerId !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para deletar esta tarefa' });
    }

    await prisma.task.delete({
      where: { id }
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}