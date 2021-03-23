const fs = require('fs')
const dayjs = require('dayjs')
const path = require('path')
const _ = require('lodash')

const ROOT = path.join(__dirname, 'root')
main()

async function main() {
  await clean()
  await create()
}

async function create() {
  await fs.promises.mkdir(ROOT)
  await Promise.all(fakeData().map((channel) => mkdir(channel)))
}

function fakeData() {
  const numChannel = 5
  const numTargetsPerChannel = 10
  const channelIds = _.range(0, numChannel).map((i) => 'channel-' + (i + 1))
  const targetIds = _.range(0, numChannel * numTargetsPerChannel).map(
    (i) => 'target-' + (i + 10),
  )
  const profiles = ['480p', '360p']
  const now = dayjs()

  const recordTimes = _.range(-3, 3)
    .map((i) => now.add(i, 'day'))
    .map((d) =>
      _.range(24)
        .map((h) => (h < 10 ? '0' + h.toString() : h.toString()))
        .map((h) => d.format('YYYYMMDD') + h),
    )
    .flat()

  return _.zip(channelIds, _.chunk(targetIds, numTargetsPerChannel)).map(
    ([channelId, channelTargetIds]) => ({
      channelId,
      targets: channelTargetIds.map((targetId) => ({
        targetId,
        profiles: profiles.map((resolution) => ({
          resolution,
          times: recordTimes,
        })),
      })),
    }),
  )
}

async function mkdir(channel) {
  const hierachy = channel.targets.map((target) =>
    target.profiles.map((profile) =>
      profile.times.map((time) =>
        path.join(
          ROOT,
          channel.channelId,
          target.targetId,
          profile.resolution,
          time,
        ),
      ),
    ),
  )
  const folderPaths = _.flattenDeep(hierachy)
  await Promise.all(
    folderPaths.map((p) => fs.promises.mkdir(p, { recursive: true })),
  )
}

async function clean() {
  await fs.promises.rmdir(ROOT, { recursive: true })
}
