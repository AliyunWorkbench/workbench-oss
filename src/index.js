const core = require('@actions/core');
const github = require('@actions/github');
const OSS = require('ali-oss');
const fs = require('fs');
const { resolve } = require('path');
const fg = require('fast-glob');

(async () => {
  try {
    const opts = {
      accessKeyId: core.getInput('ACCESS_KEY'),
      accessKeySecret: core.getInput('ACCESS_SECRET'),
      region: core.getInput('OSS_REGION'),
      bucket: core.getInput('OSS_BUCKET')
    };
    const oss = new OSS(opts);

    const assetPath = core.getInput('UPLOAD_PATH', { required: true }).replace(/\/+$/g, '');
    const targetPath = core.getInput('OSS_PATH', { required: true }).replace(/\/+$/g, '');

    if (fs.existsSync(assetPath)) {
      const stat = fs.lstatSync(assetPath);
      // upload file
      if (stat.isFile()) {
        const res = await oss.put(targetPath, assetPath);
        core.setOutput('url', res.url);
      }
      // upload dir
      if (stat.isDirectory()) {
        const files = fg.sync(`${assetPath}/**`, { dot: false, onlyFiles: true });
        const res = await Promise.all(
          files.map(file => {
            const filename = file.replace(`${assetPath}/`, '')
            oss.put(`${targetPath}/${filename}`, resolve(file)).then((res) => {
              oss.putACL(`${targetPath}/${filename}`, 'public-read');
              return res;
            });
          })
        )
        core.info('OSS result:');
        core.info(res.map(r => r.url).join('\n'));
        core.info('OSS result end!');
        // core.setOutput('url', res.map(r => r.url).join(','))
      }
    } else {
      core.setFailed('UPLOAD_PATH does not exist.');
    }
  } catch (err) {
    core.setFailed(err.message);
  }
})()
