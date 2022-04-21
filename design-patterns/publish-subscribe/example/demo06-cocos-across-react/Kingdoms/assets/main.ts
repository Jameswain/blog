// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {
  @property({ type: cc.AudioClip, tooltip: '亢龙有悔' })
  audioKangLongYouHui = null;
  @property({ type: cc.Node, tooltip: '关云长' })
  role =  null;

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start () {
    // 订阅 onKangLongYouHui 事件
    document.addEventListener('onKangLongYouHui', this.onKangLongYouHui.bind(this));
    // 订阅 onCloseMusic 事件
    document.addEventListener('onCloseMusic', this.onCloseMusic.bind(this));
  }

  // update (dt) {}

  /**
   * 亢龙有悔
   */
  onKangLongYouHui() {
    cc.audioEngine.play(this.audioKangLongYouHui, false);
    const animation = this.role.getComponent(cc.Animation);
    animation.play('super_slay');
  }

  /**
   * 关闭背景音乐
   */
  onCloseMusic() {  
    cc.find('Canvas').getComponents(cc.AudioSource)[0].pause();
  }
}
