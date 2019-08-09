import AbortController from 'abort-controller';
import cx from 'classnames';
import * as React from 'react';

import './Input.css';
import { Suggestion } from './interface';

interface Props {
  onPick: (suggestion: Suggestion) => void;
}

interface State {
  inputValue: string;
  suggestions: Suggestion[];
  cursor?: number;
  fetching: boolean;
}

enum KeyCode {
  UP = 38,
  DOWN = 40,
  ENTER = 13,
}

const Result: React.FC<{
  suggestions: Suggestion[];
  cursor?: number;
  onClick: (suggestion: Suggestion) => void;
  onHover: (i: number) => void;
}> = ({ suggestions, cursor, onClick, onHover }) => {
  if (suggestions.length === 0) {
    return null;
  }
  return (
    <ul>
      {suggestions.map((item, i) => (
        <li
          key={item.name}
          className={cx({ highlight: cursor === i })}
          onClick={() => onClick(item)}
          onMouseEnter={() => onHover(i)}
        >{`${item.name} | ${item.times}`}</li>
      ))}
    </ul>
  );
};

export default class Input extends React.Component<Props, State> {
  public state: State = {
    inputValue: '',
    suggestions: [],
    cursor: undefined,
    fetching: false
  };

  private REMOTE_ENDPOINT =
    'https://6wcm5jnqc2.execute-api.us-east-1.amazonaws.com/production/typeahead';

  private controller?: AbortController = undefined;

  private input = React.createRef<HTMLInputElement>();

  public render() {
    const suggestions = this.state.suggestions;
    return (
      <div className="AutoComplete">
        <input
          type="text"
          ref={this.input}
          value={this.state.inputValue}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onKeyDown={this.onKeyDown}
        />
        <Result
          suggestions={suggestions}
          cursor={this.state.cursor}
          onClick={this.onClick}
          onHover={this.onHover}
        />
      </div>
    );
  }

  public componentWillUnmount() {
    if (this.controller) {
      this.controller.abort();
    }
  }

  private onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Once the input is changed, it should fetch the server with suggestions.
    // It would be an http get with this format `${this.REMOTE_ENDPOINT}/${prefix}`.
    // Use AbortController to cancel previous requests when the user typing too fast.
    if(this.state.fetching) {
      if(this.controller) {
        this.controller.abort();
      }
    }
    this.controller = new AbortController();
    const prefix = event.target.value;
    this.setState({...this.state, inputValue: prefix, fetching: true});
    try {
      const res = await fetch(`${this.REMOTE_ENDPOINT}/${prefix}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: this.controller!.signal
      });
      const json = await res.json();
      this.setState({...this.state, suggestions: json, fetching: false})
    } catch (e) {
      console.warn("Fetch was aborted")
    }
  };

  private onFocus = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Once the input is changed, it should fetch the server with suggestions.
    // It would be a http get with this format `${this.REMOTE_ENDPOINT}/`.
    if(this.state.fetching) {
      if(this.controller) {
        this.controller.abort();
      }
    }
    this.controller = new AbortController();
    this.setState({...this.state, fetching: true});
    try {
      const res = await fetch(`${this.REMOTE_ENDPOINT}/`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: this.controller!.signal
      });
      const json = await res.json();
      this.setState({...this.state, suggestions: json, fetching: false})
    } catch (e) {
      console.warn("Fetch was aborted")
    }
  };

  private onClick = async (suggestion: Suggestion) => {
    this.input.current!.blur();
    this.props.onPick(suggestion);
    this.setState({...this.state, suggestions: [], cursor: undefined, inputValue: ""});
    await this.pickSuggestion(suggestion);
  };

  private pickSuggestion = async (suggestion: Suggestion) => {
    return await fetch(`${this.REMOTE_ENDPOINT}/set`, {
      method: 'post',
      body: JSON.stringify({ prefix: suggestion.name }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  private onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Implement key up and down to highlight the item.
    // If already on the first item, key up would go to the last item.
    // If already on the last item, key down would go to the first item.
    let newCursor = this.state.cursor;
    switch (e.keyCode) {
      case KeyCode.DOWN:
        if(this.state.cursor === undefined || this.state.cursor === this.state.suggestions.length - 1)
          newCursor = 0;
        else newCursor = this.state.cursor + 1;
        break;
      case KeyCode.UP:
        if(this.state.cursor === undefined || this.state.cursor === 0)
          newCursor = this.state.suggestions.length - 1;
        else newCursor = this.state.cursor - 1;
        break;
      case KeyCode.ENTER:
        if(this.state.cursor !== undefined)
          await this.onClick(this.state.suggestions[this.state.cursor]);
        break;
    }
    this.setState({...this.state, cursor: newCursor})
  };

  private onHover = (i: number) => {
    this.setState({...this.state, cursor: i})
  };
}
