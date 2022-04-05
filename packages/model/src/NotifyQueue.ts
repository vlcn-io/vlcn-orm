// Model will place items into this queue
// On placement, we'll schedule an event to dispatch items from the queue unless an event is already scheduled.
// Should this be done in an animation frame or just next event loop tick?

export type Task = () => void;
export default class NotifyQueue {
  private pending: ReturnType<typeof setTimeout> | null = null;
  // maps iterate over their keys in insertion order so we good.
  private queue: Set<Task> = new Set();

  // we don't notify more than once for items with the same key.
  // In other words, the last notification task for a key better have all the information
  // that would have been represented by previous notifications for that id in a given tick.
  enqueue(task: Task) {
    this.queue.add(task);
    if (this.pending == null) {
      this.pending = setTimeout(() => this.notify(), 0);
    }
  }

  private notify() {
    // grab the queue then flush the queue.
    // We need to do this in case someone enqueues more tasks in response to a notification.
    // Those should be processed next tick, not this tick.
    //
    // We may change this in the future to process all notifications, even those triggered by
    // a notification. That may be more "atomic" to observers.
    const queue = this.queue;
    this.queue = new Set();
    this.pending = null;

    for (const task of queue.values()) {
      task();
    }
  }
}
