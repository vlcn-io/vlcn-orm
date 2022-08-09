import { SpanStatusCode, trace, Tracer } from '@opentelemetry/api';

let tracer: Tracer;

export default {
  configure(pkg: string, version: string) {
    tracer = trace.getTracer(pkg, version);
  },

  get tracer() {
    return tracer;
  },

  startSpan(name: string) {
    return tracer.startSpan(name);
  },

  startActiveSpan<T>(name: string, cb: () => T): T {
    return tracer.startActiveSpan(name, span => {
      try {
        return cb();
      } catch (e) {
        span.recordException(e);
        throw e;
      } finally {
        span.end();
      }
    });
  },

  genStartActiveSpan<T>(name: string, cb: () => Promise<T>): Promise<T> {
    return tracer.startActiveSpan(name, async span => {
      try {
        return await cb();
      } catch (e) {
        span.recordException(e);
        throw e;
      } finally {
        span.end();
      }
    });
  },

  async genSpan<T>(name: string, cb: () => Promise<T>): Promise<T> {
    const span = tracer.startSpan(name);
    try {
      return await cb();
    } catch (e) {
      span.recordException(e);
      throw e;
    } finally {
      span.end();
    }
  },

  span<T>(name: string, cb: () => T): T {
    const span = tracer.startSpan(name);
    try {
      return cb();
    } catch (e) {
      span.recordException(e);
      throw e;
    } finally {
      span.end();
    }
  },
};
