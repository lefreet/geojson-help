# geojson-help

command line for geoJSON format and encode

---

### 1. 安装

```
$ npm install geojson-help -g
```

### 2. 格式化
将arcgis-json插件转换出的非标准geojson格式化为标准geojson格式

```bash
$ geo a2g -p <path>
```

path为文件路径，支持[glob](https://github.com/isaacs/node-glob)匹配

### 3. 格式化并且压缩
压缩为[echarts](http://echarts.baidu.com/)支持的压缩过的geojson格式，压缩算法为ZigZag，比率大概1/20左右。文件末尾会添加上`"UTF8Encoding": true`属性作为标示。使用：

```bash
$ geo a2e -p <path> -r [ratio]
```

ratio为拐点的抽稀比率，如果图层拓扑结构比较复杂，抽稀后容易导致图层失真。比较适用于大图层，拐点数据量比较大的情况。

### 4. 测试
可以将源码拷贝到本地，然后到该目录执行`npm run dev`，打开'localhost:8080/demo/index.html', 并修改'index.html'中的图层数据引用，看是否成功转换文件。或者导入到[mapshaper](http://mapshaper.org/)验证。


