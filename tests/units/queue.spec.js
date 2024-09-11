"use strict";

const QueueManager = require("./../../lib/cjs/queue");
const bullmq = require("bullmq");

jest.mock("bullmq", () => ({
	Queue: jest.fn(),
	Worker: jest.fn(),
	QueueScheduler: jest.fn()
}));

describe('QueueManager', () => {
	let mockConfig;

	beforeEach(() => {
		mockConfig = {
			storage: {
				host: "localhost",
				port: 6379,
				username: "user",
				password: "password"
			}
		};

		// Clear instances before each test
		QueueManager._instance = null;
		jest.clearAllMocks();
	});

	describe('getInstance', () => {
		it('should throw an error if instance is not initialized and no config is passed', () => {
			expect(() => QueueManager.getInstance()).toThrow("Need init instance");
		});

		it('should create a new instance with config when none exists', () => {
			const instance = QueueManager.getInstance(mockConfig);
			expect(instance).toBeInstanceOf(QueueManager);
			expect(instance.connection).toEqual({
				host: "localhost",
				port: 6379,
				username: "user",
				password: "password"
			});
		});

		it('should return the existing instance if it is already initialized', () => {
			const firstInstance = QueueManager.getInstance(mockConfig);
			const secondInstance = QueueManager.getInstance();
			expect(secondInstance).toBe(firstInstance);
		});
	});

	describe('getQueue', () => {
		it('should create a new queue if it does not exist', () => {
			const queueName = "testQueue";
			const options = { defaultJobOptions: { removeOnComplete: true } };
			const mockQueue = { add: jest.fn() };

			bullmq.Queue.mockReturnValue(mockQueue);

			const instance = QueueManager.getInstance(mockConfig);
			const queue = instance.getQueue(queueName, options);

			expect(bullmq.Queue).toHaveBeenCalledWith(queueName, expect.objectContaining({
				connection: mockConfig.storage,
				defaultJobOptions: {
					removeOnComplete: true,
				}
			}));
			expect(queue).toBe(mockQueue);
		});

		it('should return the existing queue if it is already created', () => {
			const queueName = "testQueue";
			const mockQueue = { add: jest.fn() };
			bullmq.Queue.mockReturnValue(mockQueue);

			const instance = QueueManager.getInstance(mockConfig);
			const firstQueue = instance.getQueue(queueName);
			const secondQueue = instance.getQueue(queueName);

			expect(firstQueue).toBe(secondQueue);
			expect(bullmq.Queue).toHaveBeenCalledTimes(1);
		});
	});

	describe('getWorker', () => {
		it('should create a new worker if it does not exist', () => {
			const queueName = "testWorkerQueue";
			const handleJob = jest.fn();
			const mockWorker = { on: jest.fn() };

			bullmq.Worker.mockReturnValue(mockWorker);

			const instance = QueueManager.getInstance(mockConfig);
			const worker = instance.getWorker(queueName, handleJob);

			expect(bullmq.Worker).toHaveBeenCalledWith(queueName, handleJob, expect.objectContaining({
				connection: mockConfig.storage
			}));
			expect(worker).toBe(mockWorker);
		});

		it('should return the existing worker if it is already created', () => {
			const queueName = "testWorkerQueue";
			const handleJob = jest.fn();
			const mockWorker = { on: jest.fn() };

			bullmq.Worker.mockReturnValue(mockWorker);

			const instance = QueueManager.getInstance(mockConfig);
			const firstWorker = instance.getWorker(queueName, handleJob);
			const secondWorker = instance.getWorker(queueName, handleJob);

			expect(firstWorker).toBe(secondWorker);
			expect(bullmq.Worker).toHaveBeenCalledTimes(1);
		});
	});

	describe('getScheduler', () => {
		it('should create a new scheduler if it does not exist', () => {
			const queueName = "testSchedulerQueue";
			const mockScheduler = { run: jest.fn() };

			bullmq.QueueScheduler.mockReturnValue(mockScheduler);

			const instance = QueueManager.getInstance(mockConfig);
			const scheduler = instance.getScheduler(queueName);

			expect(bullmq.QueueScheduler).toHaveBeenCalledWith(queueName, expect.objectContaining({
				connection: mockConfig.storage
			}));
			expect(scheduler).toBe(mockScheduler);
		});

		it('should return the existing scheduler if it is already created', () => {
			const queueName = "testSchedulerQueue";
			const mockScheduler = { run: jest.fn() };

			bullmq.QueueScheduler.mockReturnValue(mockScheduler);

			const instance = QueueManager.getInstance(mockConfig);
			const firstScheduler = instance.getScheduler(queueName);
			const secondScheduler = instance.getScheduler(queueName);

			expect(firstScheduler).toBe(secondScheduler);
			expect(bullmq.QueueScheduler).toHaveBeenCalledTimes(1);
		});
	});

	describe('getElementBullMq', () => {
		it('should return the correct BullMQ component', () => {
			const instance = QueueManager.getInstance(mockConfig);
			const queueComponent = instance.getElementBullMq('Queue');
			const workerComponent = instance.getElementBullMq('Worker');
			const schedulerComponent = instance.getElementBullMq('QueueScheduler');

			expect(queueComponent).toBe(bullmq.Queue);
			expect(workerComponent).toBe(bullmq.Worker);
			expect(schedulerComponent).toBe(bullmq.QueueScheduler);
		});
	});
});
