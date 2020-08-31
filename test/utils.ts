import { SinkConfiguration, SinkContainer } from "redux-sink";

export function createFactory(
  config?: SinkConfiguration,
  sinkFactory?: SinkContainer
) {
  const factory = sinkFactory || new SinkContainer();
  const store = factory.createStore(config);
  return { factory, store };
}
