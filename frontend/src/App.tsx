import React from 'react';
import { _Component, _ComponentAPI } from "./_component";
import './App.css';
import { DbDatabaseMetadata } from 'omni_common'

const SubComp = () => {
  return <h2>Hello SubCompa</h2>;
};

class Pippo {
  //private api: _ComponentAPI<Pippo2>;
  public userId: string = "";

  AsString(): string {
    return "ciao" + this.userId;
  }
}

const Comp = (props: any) => {
  //const pippo2: Pippo2 = new Pippo2();
  const component = new _Component(3);
  const componentAPI = new _ComponentAPI(
    new Pippo(),
    "https://jsonplaceholder.typicode.com/todos/1"
  );

  //const pippo = new _ComponentAPIPippo();
  //Object.assign(pippo2,pippo.value)

  return (
    <>
      <h1>
        Hello Comp: {component.Get()}
        {/*cpippo.AsString()*/}
        {componentAPI.Get().AsString()}
      </h1>
      {props.children}
      <button onClick={() => component.Set(component.Get() + 1)}>
        counter
      </button>
    </>
  );
};

export default function App() {
  const c = new DbDatabaseMetadata()
  return (
    <div className="App">
      <Comp>
        <SubComp />
        <SubComp />
        <SubComp />
      </Comp>
      <h2>Start editing to see somed magic happen!</h2>
    </div>
  );
}

