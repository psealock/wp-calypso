/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';

const ControlButton = props => (
	<div onClick={ props.onClick } className="tailor-controls__control-button">
		<span className="tailor-controls__control-button__title">{ props.title }</span>
		<Gridicon icon="chevron-right" size={ 24 } className="tailor-controls__control-button__arrow" />
	</div>
);

const ControlList = React.createClass( {
	propTypes: {
		showControl: React.PropTypes.func.isRequired,
		controls: React.PropTypes.arrayOf( React.PropTypes.shape( {
			id: React.PropTypes.string.isRequired,
			title: React.PropTypes.string.isRequired,
		} ) ),
	},

	renderAllControls() {
		return this.props.controls.map( this.renderControl );
	},

	renderControl( control ) {
		const showControl = () => this.props.showControl( control.id );
		return <ControlButton key={ control.id } title={ control.title } onClick={ showControl } />;
	},

	render() {
		return (
			<div className="tailor-controls__control-list">
				{ this.renderAllControls() }
			</div>
		);
	}
} );

export default ControlList;
