// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React, {Component} from "react";

interface ErrorBoundaryProps {
  children: JSX.Element | JSX.Element[];
}

interface ErrorBoundaryState {
  error: string | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props) {
    super(props);
    this.state = {error: null} as ErrorBoundaryState;
  }

  static getDerivedStateFromError(error) {
    return {error};
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return <span style={{color: "#CC3333"}}>{(this.state.error ?? "").toString()}</span>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
