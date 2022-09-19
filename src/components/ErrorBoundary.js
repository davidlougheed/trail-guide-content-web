import React, {Component} from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {error: null};
  }

  static getDerivedStateFromError(error) {
    return {error};
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return <span style={{color: "#CC3333"}}>{this.state.error.toString()}</span>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
