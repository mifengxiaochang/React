import React,{Component} from 'react';
export default class SliderItem extends Component{
	constructor(props){
		super(props);
	}

	render(){
		let{count,item} = this.props;
		return(
			<li className="slider-item" >
				<div className="introduction-header">
					<div className="title">{item.title}</div>
					<div className="sub-title">
						<p> {item.subtitle}</p>
						<p className="description">{item.description}</p>
					</div>
				</div>


				<img src={item.src} alt={item.alt} />



			</li>
		);
	}
}