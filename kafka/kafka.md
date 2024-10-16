# Kafka Basics

## 1. What is Kafka?

Kafka is an open-source distributed event streaming platform. It's designed to handle high-throughput, fault-tolerant, and scalable data pipelines in real-time. Imagine it as a super-fast, reliable conveyor belt for data.

## 2. What is Event Streaming?

Event streaming is the practice of capturing data in real-time from event sources like databases, sensors, mobile devices, cloud services, and software applications in the form of streams of events. It ensures a continuous flow of data that can be analyzed and acted upon instantly.

## 3. How is it Different from Message Queues and Redis Queues?

While Kafka, traditional message queues, and Redis queues all deal with data transfer, they have some key differences:

- **Persistence**: Kafka stores messages on disk and can retain them for a long time. Traditional message queues and Redis typically keep messages in memory and delete them after consumption.
- **Scalability**: Kafka is designed for high-throughput scenarios and can easily scale horizontally. Traditional queues may face challenges in scaling to the same extent.
- **Multiple Consumers**: Kafka allows multiple consumers to read the same message without removing it. In traditional queues, once a message is consumed, it's typically removed.
- **Ordering**: Kafka maintains the order of messages within a partition. This isn't always guaranteed in other queue systems.

## 4. Does Kafka Do Pub-Sub, Message Queue, or Both?

Kafka actually does both! It combines the functionality of a publish-subscribe system and a message queue:

- **Publish-Subscribe**: Multiple consumers can subscribe to the same topic and receive all messages.
- **Message Queue**: Kafka can distribute messages across a group of consumers, with each message going to only one consumer in the group.

## 5. Key Kafka Concepts

### Brokers
Brokers are the servers that make up a Kafka cluster. They store the data and serve client requests.

### Producer
A producer is an application that sends messages to Kafka topics.

### Consumer
A consumer is an application that reads messages from Kafka topics.

### Topics
A topic is a category or feed name to which messages are published. It's like a folder in a filesystem.

### Offsets
An offset is a unique identifier for a message within a partition. It represents the position of a message in the sequence of messages.

### Group ID
A group ID is a unique identifier for a consumer group. Consumers with the same group ID work together to consume messages from one or more topics, with each message being consumed by only one member of the group.

## 6. Additional Key Concepts

### Partitions
A topic can be divided into multiple partitions. Each partition is an ordered, immutable sequence of messages. Partitions allow Kafka to distribute data across multiple servers for scalability and fault tolerance.

### Replication
Kafka replicates each partition across a configurable number of servers for fault tolerance. If one server fails, the data is still available on other servers.

### Retention
Kafka can be configured to retain messages for a specified time period or until the topic reaches a certain size. This allows for replay and batch processing of data.

### Zookeeper
Zookeeper is used by Kafka for storing metadata about the Kafka cluster, as well as consumer client details.

### Consumer Groups
A group of consumers working together to consume a topic. Each message is delivered to only one consumer within each subscribing consumer group.

### Exactly-Once Semantics
Kafka ensures that each message is processed once and only once, even in the case of producer or consumer failure.

## 7. Key Features of Kafka

### High Throughput
Kafka is designed to handle high-volume data streams efficiently.

### Scalability
Kafka can be scaled out without downtime by adding more servers to the cluster.

### Durability
Data is persisted on disk and replicated within the cluster for fault tolerance.

### Low Latency
Kafka can handle real-time data streams with very low latency, often in the range of milliseconds.

## 8. Common Use Cases

- Log Aggregation
- Metrics Monitoring
- Stream Processing
- Event Sourcing
- Commit Logs

## 9. Kafka Connect

Kafka Connect is a tool for scalably and reliably streaming data between Apache Kafka and other data systems. It makes it simple to quickly define connectors that move large collections of data into and out of Kafka.

## 10. Kafka Streams

Kafka Streams is a client library for building applications and microservices, where the input and output data are stored in Kafka clusters. It combines the simplicity of writing and deploying standard Java and Scala applications with the benefits of Kafka's server-side cluster technology.