"use strict";

/**
 * Initializes queues and workers based on the provided job definitions.
 * @param {Object[]} jobs - An array of job definitions.
 * @param {string} jobs[].queue - The name of the queue to be used for the job.
 * @param {string} jobs[].name - The name of the job to be added to the queue.
 * @param {boolean} jobs[].isCronJob - A flag indicating whether the job is a cron job.
 * @param {Object} [jobs[].options={}] - Additional options for the job.
 * @param {Function} jobs[].handle - The job handler function to be used by the worker.
 * @param {Object} queueManager - An instance of the QueueManager class used to manage queues and workers.
 * @returns {Promise<void>} A promise that resolves when all queues and workers have been initialized.
 */
module.exports = async (jobs, queueManager) => {
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
};
