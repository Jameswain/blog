// example/demo08-android-call-javascript/src/case1/index.jsx
import { useState, useEffect } from 'react'
import Other from './other';
import cs from './index.module.scss';

function Case1() {
  const [text, setText] = useState('');

  useEffect(() => {
    /** 客户端会调用这个函数 */
    window.callJs = function({ type, param }) {
      if (type === 'VOLUME_UP') {
        console.log('param: ', param);
        setText('音量调大了');
      } else if (type === 'BACK') {
        setText('用户按返回键');
      }
    }
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

export default Case1
