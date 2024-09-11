# QueueManager - Usage Guide

## Usage

1. **Import the `QueueManager` class**:

	```javascript
	const { QueueManager } = require("@knfs-tech/bamimi-schedule");
	```

2. **Initialize the `QueueManager` instance**:

    Create a new instance of `QueueManager` by passing the configuration object. Ensure to provide the necessary Redis connection details.

    ```javascript
    const config = {
        storage: {
            host: 'localhost',
            port: 6379,
            username: 'your-username', // optional
            password: 'your-password'  // optional
        }
    };

    const queueManager = new QueueManager(config);
	// or get instance if use singleton
	const queueSingletonManager = QueueManager.getInstance()
    ```

3. **Retrieve a Queue instance**:

    Get a `Queue` instance by specifying the queue name. You can also pass additional options if needed.

    ```javascript
    const queue = queueManager.getQueue('myQueue', {
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: false
        }
    });
    ```

4. **Retrieve a Worker instance**:

    Obtain a `Worker` instance by specifying the queue name and job handler function. This function will process the jobs in the queue.

    ```javascript
    const handleJob = async (job) => {
        // Job processing logic
    };

    const worker = queueManager.getWorker('myQueue', handleJob);
    ```

5. **Retrieve a QueueScheduler instance**:

    Get a `QueueScheduler` instance for managing stalled jobs and other background tasks.

    ```javascript
    const scheduler = queueManager.getScheduler('myQueue');
    ```

6. **Access BullMQ components**:

    Retrieve other BullMQ components by name (e.g., `Queue`, `Worker`, `QueueScheduler`).

    ```javascript
    const BullMQQueue = queueManager.getElementBullMq('Queue');
    const BullMQWorker = queueManager.getElementBullMq('Worker');
    ```

## Notes

- **Configuration**: Ensure that the Redis connection details in the configuration are accurate.
- **Singleton Pattern**: The `QueueManager` uses the Singleton pattern, which means only one instance will be created. Use the same instance across your application.
- **Error Handling**: Implement appropriate error handling for job processing and connection issues.
- **Security**: Secure your Redis connection with proper authentication and network security measures.

