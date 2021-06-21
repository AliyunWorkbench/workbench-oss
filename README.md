
# Upload to OSS

上传单个文件或文件夹所有文件到 OSS

## Inputs

- `ACCESS_KEY`: Aliyun AccessKeyId
- `ACCESS_SECRET`: Aliyun AccessKeySecret
- `OSS_REGION`: 区域，如 `oss-cn-hangzhou`
- `OSS_BUCKET`: Bucket 名称
- `UPLOAD_PATH`: 本地待上传资源路径，一般为相对于根目录的相对路径
- `OSS_PATH`: OSS 对象存储路径

## Outputs

- `url`: 文件在 OSS 上的 url。上传多个文件时，多个 url 用逗号隔开。

## Usage

```yaml
- name: Upload to Aliyun oss
  id: upload_to_oss
  uses: royalrover/workbench-oss@master
  with:
    ACCESS_KEY: ${{ secrets.OSS_KEY_ID }}
    ACCESS_SECRET: ${{ secrets.OSS_KEY_SECRET }}
    OSS_REGION: oss-cn-hangzhou
    OSS_BUCKET: taobao
    UPLOAD_PATH: ./build
    target-path: /order/
```
