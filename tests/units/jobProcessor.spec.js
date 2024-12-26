const job = require("./../../lib/cjs/job");
const initializeJobs = require("./../../lib/cjs/job")

describe('initializeJobs', () => {
	let mockQueueManager;
	let mockQueue;
	let mockWorker;

	// Thiết lập mock cho QueueManager, Queue và Worker
	beforeEach(() => {
		// Mock Queue methods
		mockQueue = {
			upsertJobScheduler: jest.fn().mockResolvedValue(), // Mock hàm add cho queue
			on: jest.fn()  // Mock hàm on cho event listener
		};

		// Mock Worker methods
		mockWorker = {
			on: jest.fn()  // Mock hàm on cho worker event listener
		};

		// Mock QueueManager methods
		mockQueueManager = {
			getQueue: jest.fn().mockReturnValue(mockQueue), // Mock getQueue
			getWorker: jest.fn().mockReturnValue(mockWorker) // Mock getWorker
		};
	});

	it('should initialize queues and workers and add cron jobs', async () => {
		const jobs = [
			{
				queue: 'testQueue',
				name: 'testJob',
				options: {},
				schedules: [
					{
						name: "dailyEmail",
						time: {
							pattern: "0 0 * * *"

						}, // cron schedule
						prepare: { data: { email: "test@example.com" } },
					},
				],
				handle: jest.fn() // Mock handle cho job
			}
		];

		// Gọi hàm initializeJobs với mockQueueManager
		await initializeJobs(jobs, mockQueueManager);

		// Kiểm tra xem queue có được lấy đúng cách không
		expect(mockQueueManager.getQueue).toHaveBeenCalledWith('testQueue');
		// Kiểm tra xem cron job có được thêm vào queue không
		expect(mockQueue.upsertJobScheduler).toHaveBeenCalledWith(
			jobs[0].schedules[0].name,
			jobs[0].schedules[0].time, {
				name: jobs[0].name,
				data: {
					jobData: jobs[0].schedules[0].prepare.data
				},
				opts: jobs[0].options
			}
		);

		// Kiểm tra xem worker có được lấy đúng cách không
		expect(mockQueueManager.getWorker).toHaveBeenCalledWith('testQueue', jobs[0].handle, jobs[0].options);

		// Kiểm tra sự kiện 'completed' có được lắng nghe không
		expect(mockWorker.on).toHaveBeenCalledWith('completed', expect.any(Function));

		// Kiểm tra sự kiện 'failed' có được lắng nghe không
		expect(mockWorker.on).toHaveBeenCalledWith('failed', expect.any(Function));
	});

	it('should initialize queues and workers without adding cron jobs', async () => {
		const jobs = [
			{
				queue: 'testQueue',
				name: 'testJob',
				options: {},
				handle: jest.fn() // Mock handle cho job
			}
		];

		await initializeJobs(jobs, mockQueueManager);

		expect(mockQueueManager.getQueue).toHaveBeenCalledWith('testQueue');
		expect(mockQueue.upsertJobScheduler).not.toHaveBeenCalled();
		expect(mockQueueManager.getWorker).toHaveBeenCalledWith('testQueue', jobs[0].handle, jobs[0].options);
		expect(mockWorker.on).toHaveBeenCalledWith('completed', expect.any(Function));

		// Kiểm tra sự kiện 'failed' có được lắng nghe không
		expect(mockWorker.on).toHaveBeenCalledWith('failed', expect.any(Function));
	});

	it('should handle multiple jobs and workers', async () => {
		const jobs = [
			{
				queue: 'queue1',
				name: 'job1',
				options: {},
				schedules: [
					{
						name: "dailyEmail",
						time: {
							pattern: "0 0 * * *"

						}, // cron schedule
						prepare: { data: { email: "test@example.com" } },
					},
				],
				handle: jest.fn() // Mock handle cho job
			},
			{
				queue: 'queue2',
				name: 'job2',
				options: {},
				handle: jest.fn() // Mock handle cho job
			}
		];

		// Gọi hàm initializeJobs với nhiều job
		await initializeJobs(jobs, mockQueueManager);

		// Kiểm tra xem cả hai queue có được lấy đúng cách không
		expect(mockQueueManager.getQueue).toHaveBeenCalledWith('queue1');
		expect(mockQueueManager.getQueue).toHaveBeenCalledWith('queue2');

		// Đảm bảo cron job chỉ được thêm vào cho job đầu tiên
		expect(mockQueue.upsertJobScheduler).toHaveBeenCalledWith(
			jobs[0].schedules[0].name,
			jobs[0].schedules[0].time, {
			name: jobs[0].name,
			data: {
				jobData: jobs[0].schedules[0].prepare.data
			},
			opts: jobs[0].options
		}
		);

		// Kiểm tra xem worker có được lấy cho cả hai job không
		expect(mockQueueManager.getWorker).toHaveBeenCalledWith('queue1', jobs[0].handle, jobs[0].options);
		expect(mockQueueManager.getWorker).toHaveBeenCalledWith('queue2', jobs[1].handle, jobs[0].options);

		// Kiểm tra sự kiện 'completed' và 'failed' cho cả hai worker
		expect(mockWorker.on).toHaveBeenCalledWith('completed', expect.any(Function));
		expect(mockWorker.on).toHaveBeenCalledWith('failed', expect.any(Function));
	});
});