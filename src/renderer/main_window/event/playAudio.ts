import { throttle } from 'throttle-debounce';
import mp3 from '@renderer/public/music/555949.mp3';
import { mainEvent, EMainEventKey } from '@renderer/public/ipcRenderer';
/**
 * 定义一个播放源
 * */
const audio = new Audio();
audio.src = mp3;

/**
 * playAudio 播放提示音
 * @param {*}
 */
const throttlePlayAudio = throttle(150, () => {
  audio.play().catch((e) => console.error(`audio play failed with: ${e}`));
});
const playAudio = function () {
  throttlePlayAudio();
};

// 监听消息通知
mainEvent.on(EMainEventKey.MsgNotifica, () => {
  playAudio();
});
