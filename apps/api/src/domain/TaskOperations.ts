// =============================================================================
// domain/TaskOperations.ts — Deep domain module for task orchestrations
// =============================================================================

import { TaskModel } from '../models/Task.js';
import { CommentModel } from '../models/Comment.js';
import { midRank, INITIAL_RANK } from '../lib/lexorank.js';
import type { Task, TaskPriority, TaskStatus } from '@repo/types';

export interface TaskOperationsResult<T, E = T> {
  event: {
    type: 'task:created' | 'task:moved' | 'task:updated' | 'task:deleted';
    payload: E;
  };
  data: T;
}

export const TaskOperations = {
  /**
   * Creates a new task and appends it to the end of a column using LexoRank.
   */
  async createTask(params: {
    workspaceId: string;
    columnId: string;
    title: string;
    description?: string;
    priority?: TaskPriority;
    assigneeId?: string | null;
    dueDate?: string | Date | null;
  }): Promise<TaskOperationsResult<Task>> {
    // Place the new task at the end of the target column
    const last = await TaskModel
      .findOne({ columnId: params.columnId })
      .sort({ order: -1 })
      .lean();

    const order = last ? midRank(last.order, null) : INITIAL_RANK;

    const task = await TaskModel.create({
      workspaceId: params.workspaceId,
      columnId: params.columnId,
      title: params.title,
      description: params.description ?? '',
      priority: params.priority ?? 'medium',
      assigneeId: params.assigneeId ?? null,
      dueDate: params.dueDate ?? null,
      order,
    });

    const taskJSON = task.toJSON() as unknown as Task;
    return {
      event: { type: 'task:created', payload: taskJSON },
      data: taskJSON,
    };
  },

  /**
   * Moves a task to a target column and computes its new LexoRank position.
   */
  async moveTask(params: {
    taskId: string;
    targetColumnId: string;
    beforeOrder: string | null;
    afterOrder: string | null;
  }): Promise<TaskOperationsResult<Task>> {
    const newOrder = midRank(params.beforeOrder, params.afterOrder);

    const task = await TaskModel.findByIdAndUpdate(
      params.taskId,
      { $set: { columnId: params.targetColumnId, order: newOrder } },
      { returnDocument: 'after', runValidators: true },
    );

    if (!task) {
      throw new Error('Task not found');
    }

    const taskJSON = task.toJSON() as unknown as Task;
    return {
      event: { type: 'task:moved', payload: taskJSON },
      data: taskJSON,
    };
  },

  /**
   * Patches editable task fields.
   */
  async updateTask(params: {
    taskId: string;
    changes: Partial<
      Pick<Task, 'title' | 'description' | 'priority' | 'status' | 'assigneeId' | 'dueDate' | 'columnId'>
    >;
  }): Promise<TaskOperationsResult<Task>> {
    const task = await TaskModel.findByIdAndUpdate(
      params.taskId,
      { $set: params.changes },
      { returnDocument: 'after', runValidators: true },
    );

    if (!task) {
      throw new Error('Task not found');
    }

    const taskJSON = task.toJSON() as unknown as Task;
    return {
      event: { type: 'task:updated', payload: taskJSON },
      data: taskJSON,
    };
  },

  /**
   * Cascade-deletes a task and its comments.
   */
  async deleteTask(params: {
    taskId: string;
  }): Promise<TaskOperationsResult<{ taskId: string; workspaceId: string }, { taskId: string }>> {
    const task = await TaskModel.findById(params.taskId).lean();
    if (!task) {
      throw new Error('Task not found');
    }

    const workspaceId = task.workspaceId.toString();

    await Promise.all([
      CommentModel.deleteMany({ taskId: params.taskId }),
      TaskModel.findByIdAndDelete(params.taskId),
    ]);

    const payload = { taskId: params.taskId, workspaceId };
    return {
      event: { type: 'task:deleted', payload: { taskId: params.taskId } },
      data: payload,
    };
  },
};
