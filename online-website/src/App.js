import "./App.css";
import Header from "./components/Header";
import React, { Component } from "react";
import Editor from "./components/Editor";
import { getDefaultType, getDefaultLanguage } from "./storage";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: getDefaultLanguage(),
      outType: getDefaultType(),
    };
  }

  onChange = (data) => {
    console.log(data);
    this.setState({
      ...this.state,
      ...data,
    });
  };

  render() {
    const { language, outType } = this.state;
    return (
      <div className="main-app">
        <Header
          language={language}
          outType={outType}
          onChange={this.onChange}
        />

        <Editor language={language} outType={outType} />
      </div>
    );
  }
}
