const webpack = require("webpack");
const { spawn } = require("child_process");

const { taskKill } = require("../utils/common");

const webpackMainCfg = require("../configs/webpack.main");
const webpackPreloadCfg = require("../configs/webpack.preload");

require("./publicProcess");

let watch = CreateWatch();

const compiler = webpack([webpackMainCfg, webpackPreloadCfg]);

compiler.watch(
  {
    aggregateTimeout: 300,
    poll: undefined,
  },
  (err, stats) => {
    if (stats.hasErrors()) {
      console.error(stats.toString());
      return;
    }

    // 1.解析主进程编译后的信息
    const statsInfo = stats.toJson({
      chunks: true,
    });
    const { assetsByChunkName } = statsInfo.children[0];

    watch({ chunkName: assetsByChunkName });
  }
);

/**
 * 创建一个watch
 * */
function CreateWatch() {
  let allSubProcess = [
    {
      name: "electronProcess",
      subProcess: null,
      isWatchRefresh: true,
      isKill: true,
      args: ["chcp 65001 && electron", `.webpack/main.built.js`],
      env: {
        WEBPACK_DEV_SERVER_URL: "http://localhost:8888/",
      },
    },
    {
      name: "serverProcess", // 子进程名车
      subProcess: null, // 保存子进程引用
      isWatchRefresh: false, // 监听到变化是否刷新
      isKill: true, // 进程被杀掉时确认结束子进程，否则会重新启用一个新的子进程
      args: ["webpack serve --config", "./build/configs/webpack.dev.js"],
    },
  ];
  let isKillAll = false;

  /**
   * 创建一个子进程
   * */
  function createSubProcess(itemProcess) {
    if (itemProcess.subProcess) {
      itemProcess.isKill = false; // 置为false,被杀掉时，会重新启动
      taskKill(itemProcess.subProcess.pid); // 杀掉
      itemProcess.subProcess = null;
      return;
    }

    itemProcess.isKill = true;

    itemProcess.subProcess = spawn("npx", [...itemProcess.args], {
      shell: true,
      env: { ...process.env, ...itemProcess.env },
      stdio: "inherit",
    });

    itemProcess.subProcess.on("close", (code) => {
      console.log(
        `${itemProcess.name} 子进程退出 ------------------------------------------`
      );
      if (itemProcess.isKill) {
        itemProcess.subProcess = null;
        killAll(code);
      } else {
        createSubProcess(itemProcess);
      }
    });
    itemProcess.subProcess.on("error", (spawnError) =>
      console.error(spawnError)
    );
  }

  /**
   * 杀掉所有进程
   * */
  function killAll(code) {
    if (isKillAll) {
      return;
    }

    isKillAll = true;
    for (const item of allSubProcess) {
      if (item.subProcess) {
        taskKill(item.subProcess.pid);
      }
    }

    process.exit(code);
  }

  return (opthion) => {
    if (opthion.chunkName) {
      allSubProcess[0].args[1] = `.webpack/${opthion.chunkName.main}`;
    }

    // 创建所有子进程
    allSubProcess.forEach((item) => {
      if (!item.isWatchRefresh) {
        // 不需要刷新的进程，只创建一次
        if (!item.subProcess) {
          createSubProcess(item);
        }
      } else {
        createSubProcess(item);
      }
    });
  };
}
