import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

var cx = require('classnames')
var blacklist = require('blacklist')

class InputSlider extends Component {
	static propTypes = {
		axis: PropTypes.string,
		x: PropTypes.number,
		xmax: PropTypes.number,
		xmin: PropTypes.number,
		y: PropTypes.number,
		ymax: PropTypes.number,
		ymin: PropTypes.number
	}

	static defaultProps = {
		axis: 'x',
		xmin: 0,
		ymin: 0
	}

	constructor(props) {
		super(props)

		this.updateSlidePosition = this.updateSlidePosition.bind(this)
		this.handleMouseDown = this.handleMouseDown.bind(this)
		this.handleDrag = this.handleDrag.bind(this)
		this.handleDragEnd = this.handleDragEnd.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.getPos = this.getPos.bind(this)
		this.getPosition = this.getPosition.bind(this)
	}

	render() {
		let axis = this.props.axis
		let props = blacklist(this.props,
			'axis', 'x', 'y', 'xmin', 'xmax', 'ymin', 'ymax',
			'onChange', 'onDragEnd', 'className', 'onClick')

		let pos = this.getPosition()
		let valueStyle = {}

		if (axis === 'x') valueStyle.width = pos.left
		if (axis === 'y') valueStyle.height = pos.top

		props.className = cx('u-slider', `u-slider-${axis}`, this.props.className)

		return (
			<div {... props} onClick={this.handleClick} ref={node => this.element = node}>
				<div className="value" style={valueStyle}>
				</div>
				<div
					className="handle"
					onTouchStart={this.handleMouseDown}
					onMouseDown={this.handleMouseDown}
					onClick={function(evt) {
						evt.stopPropagation()
						evt.nativeEvent.stopImmediatePropagation()
					}}
					style={pos}>
				</div>
			</div>
		)
	}

	getClientPosition(evt) {
		let touches = evt.touches;

		if (touches && touches.length) {
			let finger = touches[0];

			return {
				x: finger.clientX,
				y: finger.clientY
			}
		}

		return {
			x: evt.clientX,
			y: evt.clientY
		};
	}

	getPosition() {
		let top = (this.props.y - this.props.ymin) / (this.props.ymax - this.props.ymin) * 100
		let left = (this.props.x - this.props.xmin) / (this.props.xmax - this.props.xmin) * 100

		if (top > 100) top = 100
		if (top < 0) top = 0
		if (this.props.axis === 'x') top = 0
		top += '%'

		if (left > 100) left = 100
		if (left < 0) left = 0
		if (this.props.axis === 'y') left = 0
		left += '%'

		return {
			top: top,
			left: left
		}
	}

	updateSlidePosition(pos) {
		if (!this.props.onChange) {
			return
		}

		let rect = this.element.getBoundingClientRect()
		let width = rect.width
		let height = rect.height
		let left = pos.left
		let top = pos.top
		let axis = this.props.axis

		if (left < 0) left = 0
		if (left > width) left = width
		if (top < 0) top = 0
		if (top > height) top = height

		let x = 0
		let y = 0

		if (axis === 'x' || axis === 'xy') {
			x = left / width * (this.props.xmax - this.props.xmin) + this.props.xmin
		}

		if (axis === 'y' || axis === 'xy') {
			y = top / height * (this.props.ymax - this.props.ymin) + this.props.ymin
		}

		this.props.onChange({
			x: x,
			y: y
		})
	}

	handleMouseDown(evt) {
		evt.preventDefault()

		let dom = evt.target
		// let dom = this.element
		let clientPos = this.getClientPosition(evt)

		this.start = {
			x: dom.offsetLeft,
			y: dom.offsetTop
		}

		this.offset = {
			x: clientPos.x,
			y: clientPos.y
		}

		document.addEventListener('mousemove', this.handleDrag)
		document.addEventListener('mouseup', this.handleDragEnd)
		document.addEventListener('touchmove', this.handleDrag)
		document.addEventListener('touchend', this.handleDragEnd)
		document.addEventListener('touchcancel', this.handleDragEnd)
	}

	getPos(evt) {
		let clientPos = this.getClientPosition(evt)
		let posX = clientPos.x + this.start.x - this.offset.x
		let posY = clientPos.y + this.start.y - this.offset.y

		return {
			left: posX,
			top: posY
		}
	}

	handleDrag(evt) {
		evt.preventDefault()
		let position = this.getPos(evt)
		this.updateSlidePosition(position)
	}

	handleDragEnd(evt) {
		evt.preventDefault()

		document.removeEventListener('mousemove', this.handleDrag)
		document.removeEventListener('mouseup', this.handleDragEnd)
		document.removeEventListener('touchmove', this.handleDrag)
		document.removeEventListener('touchend', this.handleDragEnd)
		document.removeEventListener('touchcancel', this.handleDragEnd)

		if (this.props.onDragEnd) {
			this.props.onDragEnd()
		}
	}

	handleClick(evt) {
		let clientPos = this.getClientPosition(evt)
		let rect = this.element.getBoundingClientRect()

		this.updateSlidePosition({
			left: (clientPos.x - rect.left),
			top: (clientPos.y - rect.top)
		})
	}
}

export default InputSlider
