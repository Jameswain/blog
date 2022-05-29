// example/demo08-android-call-javascript/src/case2/index.jsx
import { useState, useEffect } from 'react'
import bridge from '../bridge';
import Other from './other';
import cs from './index.module.scss';

function Case2() {
  const [text, setText] = useState('');

  useEffect(() => {
    // 订阅相关事件，等待客户端调用
    bridge.on('VOLUME_UP', param => {
      setText(param.msg);
    });

    bridge.on('BACK', param => {
      setText(param.msg);
    });

  }, [])

  return (
    <div className={cs.app}>
      <h3>我是app组件</h3>
      <div>
        app组件的内容: {text}
      </div>
      <Other />
    </div>
  )
}

export default Case2
