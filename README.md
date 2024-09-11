<p align="center">
  <br>
	<a href="https://scrutinizer-ci.com/g/knfs-library/bamimi-schedule/build-status/master"alt="scrutinizer">
	<img src="https://scrutinizer-ci.com/g/knfs-library/bamimi-schedule/badges/build.png?b=master" alt="Build Status" /></a>
	<a href="https://scrutinizer-ci.com/g/knfs-library/bamimi-schedule/?branch=master"alt="scrutinizer">
	<img src="https://scrutinizer-ci.com/g/knfs-library/bamimi-schedule/badges/quality-score.png?b=master" alt="Scrutinizer Code Quality" /></a>
	<a href="https://github.com/knfs-library/bamimi-schedule/actions"alt="scrutinizer">
	<img src="https://github.com/knfs-library/bamimi-schedule/actions" alt="github" /></a>
</p>

<h1> <span style="color:#013C4D;">About</span> <span style="color:#2B7F84;">Bamimi schedule</span></h1>


This is a package that helps you manage basically queue and job

---

## Install

```bash
npm i @knfs-tech/bamimi-schedule
#or
yarn add @knfs-tech/bamimi-schedule
```

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

## Author
* [Kent Phungg](https://github.com/khapu2906)
  
## Owner
* [Knfs.,jsc](https://github.com/knfs-library)

## More
* [Queue](https://github.com/knfs-library/bamimi-schedule/blob/master/docs/QUEUE.md)
* [JOB](https://github.com/knfs-library/bamimi-schedule/blob/master/docs/JOB.md)

## License

Bamimi is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
