//usr/local/bin/node
const util = require('util')
const dayjs = require('dayjs')
const _ = require('lodash')
const rimraf = util.promisify(require('rimraf'))
const path = require('path')

// rimraf('root/!(channel-1|channel-2|alskdf|)')

const ROOT = path.join(__dirname, 'root')

main()
async function main() {
  const now = dayjs()
  const yesterday = now.subtract(1, 'day')
  const hours = _.range(24).map((i) =>
    i < 10 ? '0' + i.toString() : i.toString(),
  )

  const time2Preserve = _.flattenDeep(
    [now, yesterday].map((day) =>
      hours.map((hour) => day.format('YYYYMMDD') + hour),
    ),
  )
  const preserveGlob = `!(${time2Preserve.join('|')})`
  const deleteGlob = path.join(ROOT, '*', '**', '***','****', preserveGlob)
  await rimraf(deleteGlob)
}

// async function del(channel) {
//   const hierachy = channel.targets.map((target) =>
//   target.profiles.map((profile) =>
//     profile.times.map((time) =>
//       path.join(
//         ROOT,
//         channel.channelId,
//         target.targetId,
//         profile.resolution,
//         time,
//       ),
//     ),
//   ),
// )
//   const profile = _.flattenDeep(hierachy)
// }
