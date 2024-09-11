"use strict";

export default async function processJobs(jobs, queueManager) {
	const queuePromises = [];
	const workerPromises = [];

	for (const job of jobs) {
		const queue = queueManager.getQueue(job.queue);
		queuePromises.push(queue);

		if (job.isCronJob) {
			await queue.add(job.name, {}, {
				...job.options
			});
		}

		const worker = queueManager.getWorker(job.queue, job.handle);
		workerPromises.push(worker);

		worker.on("completed", (completedJob) => {
			console.log(`Job ${completedJob.id} completed successfully`);
		});

		worker.on("failed", (failedJob, err) => {
			console.error(`Job ${failedJob.id} failed with error ${err.message}`);
		});
	}

	await Promise.all(queuePromises);
	await Promise.all(workerPromises);
}
