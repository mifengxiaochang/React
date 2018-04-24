import React,{Component} from 'react';

import SliderItem from './SliderItem/SliderItem.jsx';
import SliderDots from './SliderDots/SliderDots.jsx';
import SliderArrows from './SliderArrows/SliderArrows.jsx';

export default class Slider extends Component {
	constructor(props) {
		super(props);
		this.state={
			nowLocal:0,
		};
	}
	turn(n){
		var number = this.state.nowLocal + n;
		this.setState({nowLocal:number});

		// if(number<0){
		// 	number = number + this.props.items.length;
		// }
		// if(number >= this.props.items.length){
		// 	number = number-this.props.items.length;
		// }
		// this.setState({nowLocal:number});
	}

	// goPlay(){
	// 	if (this.props.autoplay) {
	// 		this.autoPlayFlag = setInterval(()=>{
	// 			this.turn(1);
	// 		},this.props.delay * 1000);
	// 	}
	// }

	pausePlay(){
		clearInterval(this.autoPlayFlag);
	}

	componentDidMount() {
		this.goPlay();
	}

	render() {
		let count = this.props.items.length;

		let itemNodes = this.props.items.map((item,idx)=>{
			return <SliderItem item={item} count ={count} key ={'item'+idx}/>;
		});

		let arrowsNode = <SliderArrows turn={this.turn.bind(this)}/>;

		let dotNodes = <SliderDots turn={this.turn.bind(this)} count={count} nowLocal={this.state.nowLocal}/>;

		return (
			<div
				className="slider"
				onMouseOver={this.props.pause?this.pausePlay.bind(this):null} onMouseOut={this.props.pause?this.goPlay.bind(this):null}
			>
				<ul style={{
					left:-100*this.state.nowLocal + "%",
					transitionDuration:this.props.speed + "s",
					width:this.props.items.length * 100 + "%"
				}}>
					{itemNodes}
				</ul>
				{this.props.arrows?arrowsNode:null}
				{this.props.dots?dotNodes:null}
			</div>
		);
	}
}

Slider.defaultProps={
	speed:1,
	delay:2,
	pause:true,
	autoplay:true,
	dots:true,
	arrows:true,
	items:[],
};
Slider.autoPlayFlag = null;