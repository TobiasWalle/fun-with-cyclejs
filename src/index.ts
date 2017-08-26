import { div, DOMSource, makeDOMDriver, VNode } from '@cycle/dom';
import { run } from '@cycle/run';
import xs, { Stream } from 'xstream';
import './polyfills';
import { logDriver, LogSink } from './log.driver';

interface Sources {
  DOM: DOMSource;
}

interface Sinks {
  DOM: Stream<VNode>;
  log: LogSink;
}

function main(sources: Sources): Sinks {
  const count$ = xs.periodic(1000).map(i => `Count: ${i}`);
  return {
    log: count$,
    DOM: count$.map(msg => div(msg)),
  };
}


const drivers = {
  DOM: makeDOMDriver('#app'),
  log: logDriver,
};

run(main, drivers);