// @ts-nocheck
// src/demo04.js
// 模拟实现react-redux的connect功能

// connect装饰器
function connect(mapStateToProps, mapDispatchToProps) {
  // 参数接受层
  return function connectDecorator(target) {
    // 装饰器层
    const defaultState = {
      name: 'Jameswain',
      text: 'redux默认信息'
    }; // 模拟dispatch函数

    const dispatch = payload => console.log('payload: ', payload);

    const {
      props
    } = target.prototype; // 将传入的函数进行执行，并且合并到原型的props熟悉中

    target.prototype.props = {
      ...props,
      ...mapStateToProps(defaultState),
      ...mapDispatchToProps(dispatch)
    };
  };
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  setUser: () => dispatch({
    type: 'SET_USER'
  })
});

var App = class App {
  render() {
    console.log('渲染函数');
  }
}

var connectDecorator = connect(mapStateToProps, mapDispatchToProps);
App = connectDecorator(App) || App;

const app = new App();
console.log('app: ', app);
console.log('app.props: ', app.props);