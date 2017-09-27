import React from 'react';
import Config from 'config';

import Navbar from 'components/Navbar';
import Button from 'components/Button';
import Footer from 'components/Footer';
import Banner from 'components/Banner';
import Carousal from 'components/Home/Carousal';
import Committees from 'components/Home/Committees';

export default class Home extends React.Component {
	render() {
		return (
			<div className="home-page">
				<Navbar />
				<Banner />
				<div className="content-section center">
					<h2>The largest Computer Science community at UCLA</h2>
					<p className="subheading">ACM is the largest computer science student organization at UCLA. We welcome students of all different backgrounds, interests, and skill levels to join our community and share in our passion for CS. ACM is split into six committees &mdash; each serving a different topic and mission. Although some events "belong" to a committee, being a member of a committee is the same as being a member of ACM overall. Our events are open to everyone.</p>
				</div>
				<Committees committees={Config.committees} />
				<div className="button-section center">
					{ /** CHANGE THIS LINK TO ABOUT PAGE LATER */ }
					<a href="https://www.facebook.com/uclaacm" target="_BLANK"><Button text="Learn More" /></a>
				</div><br /><br /><br />
				<div className="full-width blue">
					<div id="sign-up-section" className="content-section">
						<div id="sign-up-left" className="half-width">
							<h2>Want to stay updated on what's going on?</h2>
						</div>
						<div id="sign-up-right" className="half-width">
							<form>
								<input type="text" placeholder="enter your email..." />
								<div id="submit-form"><i className="fa fa-chevron-right"></i></div>
							</form>
						</div>
					</div>
				</div>
				<Carousal images={Config.carousal.images} />
				<Footer />
			</div>
		);
	}
}