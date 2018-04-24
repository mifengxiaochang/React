import React from 'react';
import './slider/slider.less';
//require('./slider/Slider.css');
import {render} from 'react-dom';
import { connect } from 'react-redux';
import Slider from './Slider/Slider.jsx';

const Image_Data = [
{
	src:require('./images/banner1.png'),
	alt:'images-1',
	title:'img1',
	subtitle:'1',
	description:'123'
},
{
	src:require('./images/banner2.png'),
	alt:'images-2',
	title:'img2',
	subtitle:'2',
	description:'456'
},
{
	src:require('./images/banner3.png'),
	alt:'images-3',
	title:'img3',
	subtitle:'3',
	description:'789'
}];

render(
	<Slider	
		items={Image_Data}
		pause={true}
		dots={true}
		arrow={true}
	/>,
	document.getElementById('container')
	);

