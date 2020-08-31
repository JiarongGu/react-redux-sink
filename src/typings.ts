import { SinkAction } from 'redux-sink';

export type Constructor<T = any> = new (...args: Array<any>) => T;
export type SinkSubscriber<T> = (sink: Readonly<Record<keyof T, keyof T>>) => Array<keyof T>;