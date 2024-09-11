# Job Initialization Module

This module initializes queues and workers based on the provided job definitions. It uses the `QueueManager` class to handle queue and worker management.

## Overview

The `job` function sets up queues and workers according to the job definitions provided. It supports scheduling jobs as cron jobs and provides logging for job completion and failure.

## Usage

To use the `job` function, import it and provide it with the necessary parameters.

### Example

```javascript

const { job, QueueManager } = require("@knfs-tech/bamimi-schedule");

const jobs = [
  {
    queue: "testQueue",
    name: "testJob",
    isCronJob: true,
    options: { repeat: { cron: "0 * * * *" } },
    handle: async (job) => { /* Job handler function */ }
  }
];

const queueManager = QueueManager.getInstance({
  storage: {
    host: "localhost",
    port: 6379
  }
});

job(jobs, queueManager)
  .then(() => {
    console.log("All jobs initialized");
  })
  .catch((err) => {
    console.error("Error initializing jobs:", err);
  });
```

## Function Details

Initializes queues and workers for each job in the provided jobs array. If a job is marked as a cron job (isCronJob is true), it schedules the job accordingly.

**Parameters**
- jobs: `Object[]`
   An array of job definitions.

  Each job object should have the following properties:

  - queue: string
  The name of the queue to be used for the job.

  - name: string
  The name of the job to be added to the queue.

  - isCronJob: boolean
  Indicates whether the job is a cron job.

  - options: Object (optional, default: {})
  Additional options for the job, such as scheduling and job-specific settings.

  - handle: Function
  The handler function for processing the job.

- queueManager: QueueManager
An instance of QueueManager used for managing queues and workers.

**Returns**
- `Promise<void>`
  A promise that resolves when all queues and workers have been initialized.

## Events
Workers listen for the following events:

- `completed`: Fired when a job completes successfully.

	```text
	Job <jobID> completed successfully
	```

- `failed`: Fired when a job fails.

	```text
	Job <jobID> failed with error <error.message>
	```

### Example Jobs Array
Here is an example of a jobs array:

```javascript
const jobs = [
  {
    queue: "emailQueue",
    name: "sendWelcomeEmail",
    isCronJob: false,
    options: { priority: 1 },
    handle: async (job) => {
      // Job handler logic for sending welcome emails
    }
  },
  {
    queue: "reportQueue",
    name: "generateMonthlyReport",
    isCronJob: true,
    options: { repeat: { cron: "0 0 1 * *" } },  // Runs on the first day of every month
    handle: async (job) => {
      // Job handler logic for generating reports
    }
  }
];
```