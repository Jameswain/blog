// example/demo08-android-call-javascript/src/case1/other.jsx
import React from 'react';
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
    /** 客户端会调用这个函数 */
    window.callJs = function({ type, param }) {
      if (type === 'VOLUME_DOWN') {
        this.setState({ content: '音量调小了' });
      }
    }
  }
}
