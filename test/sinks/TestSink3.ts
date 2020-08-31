import { sink, state, effect } from 'redux-sink';

@sink('testSink3')
export class TestSink3 {
  @state
  public name = 'new test sink 3 name';

  @effect
  public setName(name: string) {
    this.name = name;
  }
}
