// example/demo08-android-call-javascript/src/case2/other.jsx
import React from 'react';
import bridge from '../bridge';
import cs from './index.module.scss';

export default class Other extends React.PureComponent {
  state = {
    content: ''
  }
  
  render() {
    const { content } = this.state;
    return <div className={cs.other}>
      <h3>我是Other组件</h3>
      Other组件的内容: {content}
    </div>
  }

  componentDidMount() {
    bridge.on('VOLUME_DOWN', param => {
      this.setState({ content: '音量调小了' });
    });

    bridge.on('VOLUME_UP', param => {
      this.setState({ content: param.msg });
    });
  }
}
