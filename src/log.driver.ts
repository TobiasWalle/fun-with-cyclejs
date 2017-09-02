
import xs, { Stream } from 'xstream';
import { Driver } from '@cycle/run';

export type LogSink = Stream<any>;
export const logDriver: Driver<LogSink, void> = (sink$, name) => {
  sink$.addListener({
    next: s => console.log(s)
  });
  return xs.empty() as Stream<void>;
};
