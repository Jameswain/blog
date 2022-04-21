// example/demo05-passing-data-across-components/src/donot-use-publish-subscribe.jsx
// @ts-nocheck
import React from "react";
import './app.css'

function 亭长(props) {
  return <div className="col">
    亭长{props.shengzhi ? ': 卑职明白' : ''}
    { props.shengzhi ? '' : <span className="shangzouze" onClick={() => props.上奏折('皇上，郎中令那个王八蛋抢了我老婆!')}>上奏折</span> }
  </div>
}

function 乡(props) {
  return <div>
    <div className="col">乡{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <亭长 {...props} />
    </div>
  </div>
}

function 县令(props) {
  return <div>
    <div className="col">县令{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <乡 {...props} />
    </div>
  </div>
}

function 郡守(props) {
  return <div>
    <div className="col">郡守{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <县令 {...props} />
    </div>
  </div>
}

function 少府(props) {
  return <div className="col">少府{props.shengzhi ? ': 卑职明白' : ''}</div>
}

function 郎中令(props) {
  return <div>
    <div className="col">郎中令{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <郡守 {...props} />
    </div>
  </div>
}

function 宗正(props) {
  return <div className="col">宗正{props.shengzhi ? ': 卑职明白' : ''}</div>
}


function 御史大夫(props) {
  return <div className="col">御史大夫{props.shengzhi ? ': 卑职明白' : ''}</div>
}

function 丞相(props) {
  return <div>
    <div className="col">丞相{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <少府 {...props} />
      <郎中令 {...props} />
      <宗正 {...props} />
    </div>
  </div>
}

function 太尉(props) {
  return <div className="col">太尉{props.shengzhi ? ': 卑职明白' : ''}</div>
}

export default class 皇帝 extends React.Component {
  state = {
    shengzhi: '',
    zhouze: ''
  }

  render() {
    return  <>
      <div className="col huangdi">
        皇帝
        { this.state.zhouze ? ': 大胆郎中令,你竟敢干出如此伤天害理之事!' : '' }
        <span className="shengzhi" onClick={this.下圣旨}>下圣旨</span>
      </div>
      <div className="row">
        <御史大夫 {...this.state} />
        <丞相 {...this.state} 上奏折={this.上奏折} />
        <太尉 {...this.state} />
      </div>
    </>
  }

  下圣旨 = () => {
    this.setState({ shengzhi: '朕要大赦天下' });
  }

  上奏折 = (奏折内容) => {
    this.setState({ zhouze: 奏折内容 })
  }
}