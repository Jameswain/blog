// example/demo06-cocos-across-react/react-with-cocos/src/app.jsx
import { useCallback } from 'react';
import cs from './app.module.scss';

function App() {
  const onCloseMusic = useCallback(() => {
    document.querySelector('iframe').contentWindow.document.dispatchEvent(new CustomEvent('onCloseMusic'));
  }, []);

  const onKangLongYouHui = useCallback(() => {
    document.querySelector('iframe').contentWindow.document.dispatchEvent(new CustomEvent('onKangLongYouHui'))
    console.log(document.querySelector('iframe').contentWindow.document)
  }, []);

  return (
    <div className={cs.app}>
      <iframe className={cs.iframe} src='./web-mobile/index.html'></iframe>
      <h1 className={cs.h1}>下面是React框架里面的代码</h1>
      <div className={cs.tool}>
        <div className={cs.btn} onClick={onCloseMusic}>关闭音乐</div>
        <div className={cs.btn} onClick={onKangLongYouHui}>亢龙有悔</div>
      </div>
    </div>
  )
}

export default App