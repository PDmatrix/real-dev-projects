import * as React from 'react';

import Input from './Input';
import './Typeahead.css';
import { Suggestion } from './interface';

export interface Props {
  name?: string;
}

interface State {
  chosen: Suggestion[];
}

const Title: React.FC<Props> = ({ name }) => {
  return <h2>{name}</h2>;
};

const Chosen: React.FC<State> = ({ chosen }) => {
  if (chosen.length === 0) {
    return null;
  }

  const res = chosen.map((item, i) => (
    <p key={i}>{`${item.name} | ${item.times}`}</p>
  ));
  return <>{res}</>;
};

export default class Typeahead extends React.Component<Props, State> {
  public static defaultProps = {
    name: 'Real Typeahead',
  };

  public state: State = {
    chosen: [],
  };

  public render() {
    return (
      <div className="Root">
        <Title name={this.props.name} />
        <Input onPick={this.onPick} />
        <Chosen chosen={this.state.chosen} />
      </div>
    );
  }

  private onPick = (pick: Suggestion) => {
    this.setState(prevState => ({
      chosen: [...prevState.chosen, pick],
    }));
  };
}
