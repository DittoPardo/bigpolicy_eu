import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectModel } from '../../shared/project/index';
import { TaskModel, TaskService } from '../../shared/task/index';
import { UserService } from '../../shared/user/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-bp-task-edit',
  templateUrl: './task.edit.component.html',
  styleUrls: ['./task.edit.component.scss']
  })

export class TaskEditComponent implements OnInit {

  @Input() projectId = '';
  // @Input() project: ProjectModel;

  isUpdateMode = false;

  task: TaskModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private location: Location
  ) {
    this.task = new TaskModel();
  }

  /**
   * Initialization Event Handler, used to parse route params
   * like `id` in task/:id/edit)
   */
  ngOnInit() {
    // if project id is provided, it means we editing / adding task from inside the parent project
    console.log('Task Editor Initialization, provided Project Id:', this.projectId);

    if ( this.projectId ) {
      return;
    }

    this.route.params
      .map(params => {
        console.log('Route params:', params);
        return params['id'];
      })
      .subscribe((taskId) => {
        console.log('Task Editor by ID from route params:', taskId);
        if (taskId) {
          this.taskService.getTask(taskId).subscribe( data => {
            this.parseLoadedTask(data);
          });
        }
      });
  }

  /**
   * Task loading handler
   * @param {data} Loaded task data
   */
  parseLoadedTask(task) {
    console.log('Set task:', task, ', project =', task.projectId );
    this.isUpdateMode = true;
    this.task = new TaskModel();
    this.task.parseData(task);
  }

  /**
   * Remove this task
   * @param {task} Task being viewed
   */
  deleteTask(task: TaskModel) {
    // Delete from DB
    this.taskService.deleteTask(task);

    this.router.navigate(['/project/' + task.projectId]);
    return false;
  }

  /**
   * Saves new or edited task by asking one of two service methods for DB.
   * @returns return false to prevent default form submit behavior to refresh the page.
   */
  // FIXME: Complete Task processing
  saveTask(): boolean {
    if (this.isUpdateMode) {
      // Update existing task
      this.taskService.updateTask(this.task)
      .subscribe(
        data => { this.gotoTask(data); },
        err => (er) => console.error('Task update error: ', er),
        () => {}
      );
    } else {
      // Create new task
      this.task.projectId = this.projectId;
      console.log('idd =', this.task.projectId);
      this.taskService.createTask(this.task)
      .subscribe(
        data => { this.gotoTask(data); },
        err => (er) => console.error('Task creation error: ', er),
        () => {}
      );
    }
    return false;
  }

  gotoTask(task) {
    const taskId = task._id;
    if (taskId) {
      console.log('𝕱 𝕱 𝕱 Go to task by ID: ', taskId);
      this.router.navigate(['/task', taskId]).then(_ => {
        // navigation is done
      });
    }
  }

  cancelEditing() {
    this.location.back();
  }
}
