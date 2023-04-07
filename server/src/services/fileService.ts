import * as fs from 'fs'
import { ParameterizedContext } from 'koa'
import Router from 'koa-router'
import * as path from 'path'
import { stats } from '../libs/stats'

const videoPathList = [
  // 'E:/FFOutput/p3.mp4',
]

export async function getImg(filename: string) {
  // const basePath = `E:/DeepLearning/ComputerVision/yolov7/yolov7-main/utils/nomask_people/${filename}`
  const basePath = `/data/management/nomask_people/${filename}`
  const data = await fs.promises.readFile(basePath)
  return data
}

export async function listVideo() {
  // const basePath = `E:/DeepLearning/ComputerVision/yolov7/yolov7-main/runs/detect`
  const basePath = `/data/management/detect`
  const dirArr = await fs.promises.readdir(basePath)
  const videoArr = []
  const tempVideo = { createdAt: '', size: 0 }
  for await (const dir of dirArr) {
    const videoPath = path.join(basePath, dir)
    const videoFile = await fs.promises.readdir(videoPath)
    for await (const video of videoFile) {
      if (path.extname(video) === '.mp4') {
        let tempPath = path.join(videoPath, video)
        videoPathList.push(tempPath)
        const fsStats = fs.statSync(tempPath)
        tempVideo.createdAt = fsStats.birthtime.toLocaleString()
        tempVideo.size = fsStats.size / (1024 * 1024)
        videoArr.push({ ...tempVideo })
      }
    }
  }
  
  return videoArr
}

export async function fetchVideo(
  index: number,
  ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>
) {
  if (index >= videoPathList.length) throw stats.ErrFileNotFind
  let range = ctx.request.header['range']
  let bytes = range.split('=')[1]
  let diskPath = videoPathList[index]
  let fsStats = fs.statSync(diskPath) 
  let start = Number.parseInt(bytes.split('-')[0]) 
  let end = fsStats.size - 1 
  if (fsStats.isFile()) {
    return new Promise<void>((rev, rej) => {
      var stream = fs.createReadStream(diskPath, { start: start, end: end })
      ctx.res.on('close', function () {
        stream.destroy()
      })
      ctx.set('Content-Range', `bytes ${start}-${end}/${fsStats.size}`)
      ctx.set('Accept-Ranges', `bytes`)
      ctx.status = 206
      ctx.type = 'video/mp4'
      stream.on('open', function () {
        if (ctx.res.socket.writable) {
          try {
            stream.pipe(ctx.res)
          } catch (e) {
            stream.destroy()
          }
        } else {
          stream.destroy()
        }
      })
      stream.on('error', function (err) {
        if (ctx.res.socket.writable) {
          try {
            ctx.body = err
          } catch (e) {
            stream.destroy()
          }
        }
        rej()
      })
      stream.on('end', function () {
        rev()
      })
    })
  }
}
