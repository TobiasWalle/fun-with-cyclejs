import { button, div, DOMSource, makeDOMDriver, VNode } from '@cycle/dom';
import { run } from '@cycle/run';
import xs, { Stream } from 'xstream';
import { logDriver } from './log.driver';
import './polyfills';

interface Sources {
  DOM: DOMSource;
}

interface Sinks {
  DOM: Stream<VNode>;
}

function countToMsg(i: number): string {
  return `Count: ${i}`;
}

function msgToDom(msg: string): VNode {
  return div(msg);
}

function main(sources: Sources): Sinks {
  const count$ = sources.DOM.select('.button')
    .events('click')
    .map(() => xs.periodic(1000))
    .startWith(xs.periodic(1000))
    .flatten();

  const doubleCount$ = count$.map(i => i * 2);
  const tripleCount$ = count$.map(i => i * 3);
  const power2Count$ = count$.map(i => i ** 2);

  const msg$ = xs.combine(
    doubleCount$.map(countToMsg),
    tripleCount$.map(countToMsg),
    power2Count$.map(countToMsg),
  );
  return {
    DOM: msg$
      .map(counts => counts.map(msgToDom))
      .map(messages => div(
        [...messages, button('.button', 'Reset')]
      ))
    ,
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  log: logDriver,
};

function mapObject<T, O extends {[key in keyof O]: T}, R>(obj: O, callback: (e: T, key: string) => R): {[key in keyof O]: R} {
  return Object.keys(obj)
    .reduce<{[key in keyof O]: R}>((result, key: keyof O) => {
      result[key] = callback(obj[key], key);
      return result;
    }, {} as any);
}

function middleware(source: Sources): Sinks {
  let sinks: Sinks = main(source);
  console.log(sinks);
  console.log(source);
  return sinks;
}

run(middleware, drivers);