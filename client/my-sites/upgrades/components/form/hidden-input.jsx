/**
 * External dependencies
 */
var React = require( 'react' ),
	isEmpty = require( 'lodash/isEmpty' );

/**
 * Internal dependencies
 */
var Input = require( './input' );

module.exports = React.createClass( {
	displayName: 'HiddenInput',

	componentWillReceiveProps: function( nextProps ) {
		if ( ! this.state.toggled && ! isEmpty( nextProps.value ) ) {
			this.setState( { toggled: true } );
		}
	},

	getInitialState: function() {
		return {
			toggled: false
		};
	},

	handleClick: function( event ) {
		event.preventDefault();

		this.setState( {
			toggled: true
		} );
	},

	render: function() {
		if ( this.state.toggled ) {
			return (
				<Input { ...this.props } autofocus />
			);
		}

		return (
			<div className="hidden-input">
				<a href="" onClick={ this.handleClick }>{ this.props.text }</a>
			</div>
		);
	}
} );
