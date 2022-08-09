import { tracer } from '@aphro/instrument';

tracer.configure('@aphro/wa-sqlite-connector', '0.2.1');

export default tracer;
