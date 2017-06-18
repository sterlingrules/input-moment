import React, { Component } from 'react'
import Calendar from'./calendar.jsx'
import Time from'./time.jsx'
import moment from 'moment'

const cx = require('classnames');
const blacklist = require('blacklist');

class InputMoment extends Component {
	constructor(props) {
		super(props)

		this.state = {
			tab: 0
		}

		this.handleSave = this.handleSave.bind(this)
	}

	static defaultProps = {
		type: 'calendar',
		prevMonthIcon: 'ion-ios-arrow-left',
		nextMonthIcon: 'ion-ios-arrow-right'
	}

	render() {
		let { tab } = this.state
		let { type } = this.props
		let m = this.props.moment
		let props = blacklist(this.props, 'className', 'moment', 'prevMonthIcon', 'nextMonthIcon', 'onSave')

		props.className = cx('m-input-moment', this.props.className)

		return (
			<div {...props}>
				<div className="tabs">
					{type == 'calendar' && (
						<Calendar
							className="tab is-active"
							moment={m}
							onChange={this.props.onChange}
							prevMonthIcon={this.props.prevMonthIcon}
							nextMonthIcon={this.props.nextMonthIcon} />
					)}
					{type == 'time' && (
						<Time
							className="tab is-active"
							moment={m}
							onChange={this.props.onChange} />
					)}
				</div>

				<button type="button" className="im-btn btn-save ion-checkmark"
					onClick={this.handleSave}>
					Save
				</button>
			</div>
		);
	}

	handleSave(evt) {
		evt.preventDefault();

		if (this.props.onSave) {
			this.props.onSave()
		}
	}
}

export default InputMoment
