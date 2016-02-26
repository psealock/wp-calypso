/**
 * External dependencies
 */
var React = require( 'react' ),
	noop = require( 'lodash/noop' ),
	classnames = require( 'classnames' );

/**
 * Internal dependencies
 */
var Popover = require( 'components/popover' ),
	hasTouch = require( 'lib/touch-detect' ).hasTouch,
	SiteSelector = require( 'components/site-selector' );

module.exports = React.createClass( {
	displayName: 'SitesPopover',

	propTypes: {
		sites: React.PropTypes.object,
		siteQuerystring: React.PropTypes.oneOfType( [ React.PropTypes.string, React.PropTypes.bool ] ),
		context: React.PropTypes.object,
		visible: React.PropTypes.bool,
		onClose: React.PropTypes.func,
		position: React.PropTypes.string,
		groups: React.PropTypes.bool,
		className: React.PropTypes.string
	},

	getInitialState: function() {
		return {
			popoverVisible: false
		};
	},

	getDefaultProps: function() {
		return {
			visible: false,
			onClose: noop,
			position: 'bottom left',
			groups: false,
			siteQuerystring: false,
			className: ''
		};
	},

	componentDidMount: function() {
		this.updatePopoverVisibilityState();
	},

	componentDidUpdate: function( prevProps ) {
		if ( this.props.visible !== prevProps.visible ) {
			this.updatePopoverVisibilityState();
		}
	},

	updatePopoverVisibilityState: function() {
		this.setState( {
			popoverVisible: this.props.visible
		} );
	},

	render: function() {
		return (
			<Popover
				isVisible={ this.props.visible }
				context={ this.props.context }
				onClose={ this.props.onClose }
				position={ this.props.position }
				className={ classnames( this.props.className, 'popover sites-popover' ) }>
				{ this.state.popoverVisible ?
					<SiteSelector
						sites={ this.props.sites }
						siteBasePath="/post"
						siteQuerystring={ this.props.siteQuerystring }
						showAddNewSite={ false }
						indicator={ false }
						autoFocus={ ! hasTouch() }
						groups={ true }
						onClose={ this.props.onClose } /> : null }
			</Popover>
		);
	}
} );
