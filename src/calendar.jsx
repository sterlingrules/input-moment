import React, { Component } from 'react'
import moment from 'moment'

const cx = require('classnames');
const blacklist = require('blacklist');
const range = require('lodash/range');
const chunk = require('lodash/chunk');

const Day = (props) => {
	let i = props.i
	let w = props.w
	let prevMonth = (w === 0 && i > 7)
	let nextMonth = (w >= 4 && i <= 14)
	let _props = blacklist(props, 'i', 'w', 'd', 'className')

	_props.className = cx({
		'prev-month': prevMonth,
		'next-month': nextMonth,
		'current-day': !prevMonth && !nextMonth && (i === props.d)
	})

	return <td {..._props}>{i}</td>
}

class Calendar extends Component {
	constructor(props) {
		super(props)

		// this.selectDate = this.selectDate.bind(this)
		this.prevMonth = this.prevMonth.bind(this)
		this.nextMonth = this.nextMonth.bind(this)
	}

	render() {
		let m = this.props.moment
		let d = m.date()
		let d1 = m.clone().subtract(1, 'month').endOf('month').date()
		let d2 = m.clone().date(1).day()
		let d3 = m.clone().endOf('month').date()

		let days = [].concat(
			range(d1 - d2 + 1, d1 + 1),
			range(1, d3 + 1),
			range(1, 42 - d3 - d2 + 1)
		)

		let weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

		return (
			<div className={cx('m-calendar', this.props.className)}>
				<div className="toolbar">
					<button type="button" className="prev-month" onClick={this.prevMonth}>
						<i className={this.props.prevMonthIcon}/>
					</button>
					<span className="current-date">{m.format('MMMM YYYY')}</span>
					<button type="button" className="next-month" onClick={this.nextMonth}>
						<i className={this.props.nextMonthIcon}/>
					</button>
				</div>

				<table>
					<thead>
						<tr>
							{weeks.map((week, index) => {
								<td key={index}>{week}</td>
							})}
						</tr>
					</thead>

					<tbody>
						{chunk(days, 7).map((row, w) => (
							<tr key={w}>
								{row.map((i) => (
									<Day key={i} i={i} d={d} w={w}
										onClick={this.selectDate.bind(this, i, w)}
									/>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}

	selectDate(i, w) {
		let prevMonth = (w === 0 && i > 7)
		let nextMonth = (w >= 4 && i <= 14)

		let m = this.props.moment

		m.date(i)

		if (prevMonth) m.subtract(1, 'month')
		if (nextMonth) m.add(1, 'month')

		this.props.onChange(m)
	}

	prevMonth(e) {
		e.preventDefault();
		this.props.onChange(this.props.moment.subtract(1, 'month'));
	}

	nextMonth(e) {
		e.preventDefault();
		this.props.onChange(this.props.moment.add(1, 'month'));
	}
}

export default Calendar
