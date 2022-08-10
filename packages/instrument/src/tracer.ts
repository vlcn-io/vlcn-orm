import { Span, SpanStatusCode, trace } from '@opentelemetry/api';

export type Tracer = ReturnType<typeof getTracer>;

export default function getTracer(pkg: string, version: string) {
  const tracer = trace.getTracer(pkg, version);
  return {
    startSpan(name: string) {
      return tracer.startSpan(name);
    },

    startActiveSpan<T>(name: string, cb: (span: Span) => T): T {
      return tracer.startActiveSpan(name, span => {
        try {
          return cb(span);
        } catch (e) {
          if (e instanceof Error) {
            span.recordException(e);
          } else {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: (e as any)?.message,
            });
          }
          throw e;
        } finally {
          span.end();
        }
      });
    },

    genStartActiveSpan<T>(name: string, cb: (span: Span) => Promise<T>): Promise<T> {
      return tracer.startActiveSpan(name, async span => {
        try {
          return await cb(span);
        } catch (e) {
          if (e instanceof Error) {
            span.recordException(e);
          } else {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: (e as any)?.message,
            });
          }
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
        if (e instanceof Error) {
          span.recordException(e);
        } else {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: (e as any)?.message,
          });
        }
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
        if (e instanceof Error) {
          span.recordException(e);
        } else {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: (e as any)?.message,
          });
        }
        throw e;
      } finally {
        span.end();
      }
    },
  } as const;
}
