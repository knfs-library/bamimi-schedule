"use strict";

const bullmq = require("bullmq");

/**
 * @class
 * @classdesc Manages queues, workers, and schedulers for BullMQ.
 */
class QueueManager {
	static _instance

	/**
	 * @constructor
	 * @param {Object} [config={}] - Configuration for connection and other options.
	 * @param {Object} [config.storage] - Redis connection configuration.
	 * @param {string} [config.storage.host] - Redis host address.
	 * @param {number} [config.storage.port] - Redis port.
	 * @param {string} [config.storage.username] - Redis username (if applicable).
	 * @param {string} [config.storage.password] - Redis password (if applicable).
	 */
	constructor(config) {
		this.connection = {
			host: config.storage?.host ?? '127.0.0.1',
			port: config.storage?.port ?? 6379,
			username: config.storage?.username ?? undefined,
			password: config.storage?.password ?? undefined
		};

		this.queues = {};
		this.workers = {};
		this.schedulers = {};

		QueueManager._instance = this;
	}

	/**
	 * Retrieves the singleton instance of QueueManager.
	 * @param {Object} [config={}] - Configuration for connection and other options.
	 * @param {Object} [config.storage] - Redis connection configuration.
	 * @param {string} [config.storage.host] - Redis host address.
	 * @param {number} [config.storage.port] - Redis port.
	 * @param {string} [config.storage.username] - Redis username (if applicable).
	 * @param {string} [config.storage.password] - Redis password (if applicable).
	 * @returns {QueueManager} The singleton instance of QueueManager.
	 */
	static getInstance(config = null) {
		if (!QueueManager._instance && !config) {
			throw new Error("Need init instance");
		} else if(config) {
			QueueManager._instance = new QueueManager(config);
		}
		
		return QueueManager._instance;
	}

	/**
	 * Retrieves a Queue instance for the specified queue name.
	 * @param {string} queueName - The name of the queue.
	 * @param {Object} [options={}] - Configuration options for the queue.
	 * @param {Object} [options.defaultJobOptions] - Default job options.
	 * @returns {Queue} The Queue instance.
	 */
	getQueue(queueName, options = {}) {
		if (!this.queues[queueName]) {
			this.queues[queueName] = new bullmq.Queue(queueName, {
				connection: this.connection,
				defaultJobOptions: {
					removeOnComplete: true,
					removeOnFail: false,
				},
				...options
			});
		}
		return this.queues[queueName];
	}

	/**
	 * Retrieves a Worker instance for the specified queue.
	 * @param {string} queueName - The name of the queue.
	 * @param {Function} handleJob - The job handler function.
	 * @param {Object} [options={}] - Configuration options for the worker.
	 * @returns {Worker} The Worker instance.
	 */
	getWorker(queueName, handleJob, options = {}) {
		if (!this.workers[queueName]) {
			this.workers[queueName] = new bullmq.Worker(queueName, handleJob, {
				connection: this.connection,
				...options
			});
		}
		return this.workers[queueName];
	}

	/**
	 * Retrieves a QueueScheduler instance for the specified queue.
	 * @param {string} queueName - The name of the queue.
	 * @param {Object} [options={}] - Configuration options for the QueueScheduler.
	 * @returns {QueueScheduler} The QueueScheduler instance.
	 */
	getScheduler(queueName, options = {}) {
		if (!this.schedulers[queueName]) {
			this.schedulers[queueName] = new bullmq.QueueScheduler(queueName, {
				connection: this.connection,
				...options
			});
		}

		return this.schedulers[queueName];
	}

	/**
	 * Retrieves a BullMQ component by its element name.
	 * @param {string} element - The name of the BullMQ element (e.g., 'Queue', 'Worker', 'QueueScheduler').
	 * @returns {Function} The BullMQ component.
	 */
	getElementBullMq(element) {
		return bullmq[element];
	}
}

module.exports = QueueManager;
