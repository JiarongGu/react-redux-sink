import { assert } from 'chai';
import { SinkConfiguration, SinkContainer } from 'redux-sink';

import { StateOnlySink, TestSink, TestSink2, TestSink3 } from './sinks';

export function createFactory(config?: SinkConfiguration, sinkFactory?: SinkContainer) {
  const factory = sinkFactory || new SinkContainer();
  const store = factory.createStore(config);
  return { factory, store };
}

describe('sink test', () => {
  it('can inherit state from store', () => {
    const state = { name: 'initialized name' };
    const { factory } = createFactory({
      preloadedState: {
        testSink: { state }
      }
    });
    const testSink = factory.getSink(TestSink);
    assert.equal(state, testSink.state);
  });

  it('can inherit state from sink', () => {
    const { factory, store } = createFactory();
    const stateOnlySink = factory.getSink(StateOnlySink);
    const state = store.getState() as any;

    assert.equal(state.stateOnly.firstState, stateOnlySink.firstState);
    assert.equal(state.stateOnly.secondState, stateOnlySink.secondState);
  });

  it('can state match after instance applied', () => {
    const { factory, store } = createFactory();
    const testSink = factory.getSink(TestSink3);
    const state = store.getState() as any;
    assert.equal(testSink.name, state.testSink3.name);
  });

  it('can share state between instance', () => {
    const { factory } = createFactory();
    const testSink1 = factory.getSink(TestSink);
    const testSink2 = factory.getSink(TestSink);
    assert.equal(testSink1.state, testSink2.state);
  });

  it('can share property between instance', () => {
    const { factory } = createFactory();
    const testSink1 = factory.getSink(TestSink2);
    const testSink2 = factory.getSink(TestSink2);

    const assertion1 = (prop: number) => { assert.equal(prop, 1); };
    const assertion2 = (prop: number) => { assert.equal(prop, 2); };

    testSink1.setProp(assertion1);
    testSink2.setProp(assertion2);
  });

  it('can sink created before store initialized', () => {
    const factory = new SinkContainer();
    const testSink = factory.getSink(TestSink);

    const state = { name: 'initialized name before store' };
    const store = factory.createStore({ preloadedState: { testSink: { state } } });

    assert.equal(state, testSink.state);
  });

  it('can call multiple reducers from effect', () => {
    const { factory, store } = createFactory();
    const testSink = factory.getSink(TestSink);
    testSink.setAll('test name', 'test value');
    const state = testSink.state;
    assert.equal('test name', state.name);
    assert.equal('test value', state.value);
  });

  it('can sink call reducers from other sink by effect', () => {
    const { factory, store } = createFactory();
    const testSink = factory.getSink(TestSink);
    const testSink2 = factory.getSink(TestSink2);
    testSink2.setName('new name hamah');
    const state = store.getState();
    assert.equal('new name hamah', testSink.state.name);
  });

  it('can sink update other sinks state', () => {
    const { factory, store } = createFactory();
    const testSink = factory.getSink(TestSink);
    const testSink2 = factory.getSink(TestSink2);
    testSink2.directUpdateName('new name hamah');
    const state = store.getState() as any;
    assert.equal('new name hamah', testSink.state.name);
    assert.equal(testSink.state.name, state.testSink.state.name);
  });

  it('can trigger run when action detected', () => {
    const { factory } = createFactory({ useTrigger: true });
    const testSink = factory.getSink(TestSink);
    testSink.setAll('test name', 'test value');
    assert.equal('test name', testSink.state.copy);
  });

  it('can set store state via effect and trigger', () => {
    const { factory } = createFactory({ useTrigger: true });
    const testSink = factory.getSink(TestSink);

    testSink.setAll('test name', 'test value');
    assert.equal('test name', testSink.state.copy);
  });
});
