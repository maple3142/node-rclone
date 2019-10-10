const os = require('os')
const path = require('path')
const execa = require('execa')
const { objectKeysToCamel } = require('./utils')

const DEFAULT_RCLONE_CONF = path.join(os.homedir(), '.config/rclone/rclone.conf')

class RClone {
	constructor({ conf = DEFAULT_RCLONE_CONF, pass = '', rclone = 'rclone' } = {}) {
		this.conf = conf
		this.pass = pass
		this.rclone = rclone
	}
	exec(...args) {
		return execa(this.rclone, ['--config', this.conf].concat(args), {
			env: {
				RCLONE_CONFIG_PASS: this.pass
			}
		})
	}
	resolve(drive, path = '/') {
		if (!drive.endsWith(':')) {
			drive = drive += ':'
		}
		if (!path.startsWith('/')) {
			path = '/' + path
		}
		return drive + path
	}
	async ls(drive, path = '/') {
		path = this.resolve(drive, path)
		const { stdout } = await this.exec('lsjson', path)
		return JSON.parse(stdout)
			.map(objectKeysToCamel)
			.map(obj => {
				obj.id = obj.iD // because the original name is "ID" (not pascalcase)
				delete obj.iD
				return obj
			})
	}
	cat(drive, path = '/') {
		path = this.resolve(drive, path)
		return this.exec('cat', path).stdout
	}
	rcat(drive, path = '/') {
		path = this.resolve(drive, path)
		return this.exec('rcat', path).stdin
	}
}
module.exports = RClone
