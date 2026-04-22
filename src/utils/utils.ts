const BASE = import.meta.env.BASE_URL
/**
 * 统一拼接public静态资源
 * @param path /images/xxx.png
 * 外网http/https直接放行，防重复斜杠、防缺前缀
 * 需要使用getPublicResource的情况：
 * JS/TS 变量里的图片路径 const url = "/images/c.png"
 * 动态拼接的路径 const url = `/images/${name}.png`
 * 运行时才确定的路径 const avatar = res.data.avatar
 * 不需要使用getPublicResource的情况：
 * 模板里直接写死的路径 <img src="/images/a.png" />
 * CSS / SCSS 里直接写的路径 background: url(/images/b.png);
 */
function getPublicResource(path: string): string {
    // 外网http/https直接放行
    if (/^https?:\/\//.test(path)) return path
    // 防重复斜杠、防缺前缀
    return `${BASE}${path.replace(/^\//, '')}`
}



/**
 * 处理JSON图片路径
 * @param json 图片列表JSON字符串
 * @param index 可选索引，不传返回数组，传了返回对应项/空字符串
 */
function getJsonImagePath(
    json?: string,
    index?: number
) {
    console.log(json)
    if (!json || (!index && index !== 0)) {
        return '';
    }

    let fileList: ImageFileItem[] = []

    try {
        fileList = json ? JSON.parse(json) : []
        fileList.forEach((item) => {
            item.url = '/hrssc-storage' + item.url
            item.status = 'finished'
        })
    } catch (error) {
        // window.$message.info('文件解析失败')
    }

    // 传了 index 且合法 → 返回对应项
    if (index >= 0 && index < fileList.length) {
        return fileList[index].url || ''
    }

    // 不合法 → 返回null
    return ''
}

function getJsonImageList(json?: string) {
    let fileList: ImageFileItem[] = []

    try {
        fileList = json ? JSON.parse(json) : []
        fileList.forEach((item) => {
            item.url = '/hrssc-storage' + item.url
            item.status = 'finished'
        })
    } catch (error) {
        // window.$message.info('文件解析失败')
    }
    console.log(fileList)
    return fileList;
}

export{
    getPublicResource,
    getJsonImagePath,
    getJsonImageList,
}