
import { SinkFactory } from 'redux-sink';

import { createSinking as _createSinking } from './createSinking';
import { createUseSink as _createUseSink } from './createUseSink';

/**
 * connect sinks with component, only connect state, reducers and effects
 * @param sinks array args of sink classes
 */
export const sinking = _createSinking(SinkFactory);

/**
 * connect sink with using hook
 * @param sink sink class
 */
export const useSink = _createUseSink(SinkFactory);

/**
 * create sinking connector use SinkContainer
 */
export const createSinking = _createSinking;

/**
 * create useSink hook use SinkContainer
 */
export const createUseSink = _createUseSink;
