// example/demo05-passing-data-across-components/src/use-react-redux.jsx
// @ts-nocheck
import React from "react";
import { Provider, useSelector, connect } from 'react-redux';
import store from './store';
import { reduxShangZhouZe, reduxXiaShengZhi } from './store/action';
import './app.css'

function 亭长() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div className="col">
    亭长{shengzhi ? ': 卑职明白' : ''}
    { shengzhi ? '' : <span className="shangzouze" onClick={() => reduxShangZhouZe('皇上，郎中令那个王八蛋抢了我老婆!')}>上奏折</span> }
  </div>
}

function 乡() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div>
    <div className="col">乡{shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <亭长 />
    </div>
  </div>
}

function 县令() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div>
    <div className="col">县令{shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <乡 />
    </div>
  </div>
}

function 郡守() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div>
    <div className="col">郡守{shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <县令 />
    </div>
  </div>
}

function 少府() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div className="col">少府{shengzhi ? ': 卑职明白' : ''}</div>
}

function 郎中令() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div>
    <div className="col">郎中令{shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <郡守 />
    </div>
  </div>
}

function 宗正() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div className="col">宗正{shengzhi ? ': 卑职明白' : ''}</div>
}


function 御史大夫() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div className="col">御史大夫{shengzhi ? ': 卑职明白' : ''}</div>
}

function 丞相() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div>
    <div className="col">丞相{shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <少府 />
      <郎中令 />
      <宗正 />
    </div>
  </div>
}

function 太尉() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div className="col">太尉{shengzhi ? ': 卑职明白' : ''}</div>
}

@connect(state => state)
class 皇帝 extends React.Component {
  render() {
    return <>
      <div className="col huangdi">
        皇帝
        { this.props.zhouze ? ': 大胆郎中令,你竟敢干出如此伤天害理之事!' : '' }
        <span className="shengzhi" onClick={this.下圣旨}>下圣旨</span>
      </div>
      <div className="row">
        <御史大夫 />
        <丞相 />
        <太尉 />
      </div>
    </>
  }

  下圣旨 = () => {
    reduxXiaShengZhi('朕要大赦天下');
  }
}

export default () => <Provider store={store}>
  <皇帝 />
</Provider>