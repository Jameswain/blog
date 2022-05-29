import React from 'react'
import ReactDOM from 'react-dom'
import DoNotUsePublishSubscribe from './donot-use-publish-subscribe';   // 没有使用发布订阅
import UsePublishSubscribe from './use-publish-subscribe';              // 使用发布订阅跨组件传递数据
import UserReactRedux from './use-react-redux';                         // 使用react-redux
import './main.css'

ReactDOM.render(
  <React.StrictMode>
    {/* <DoNotUsePublishSubscribe /> */}
    {/* <UsePublishSubscribe /> */}
    {/* <UserReactRedux /> */}
  </React.StrictMode>,
  document.getElementById('root')
)
