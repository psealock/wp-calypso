import React from 'react';
import debugFactory from 'debug';
import noop from 'lodash/noop';

const debug = debugFactory( 'calypso:site-preview' );

export default React.createClass( {
	displayName: 'SitePreview',

	propTypes: {
		// The markup to display in the preview.
		markup: React.PropTypes.string.isRequired,
		// The handler to call when an element is clicked. Will be passed the event.
		onClick: React.PropTypes.func,
		// The funciton to call when the DOM is loaded. Will be passed the DOM.
		onLoad: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			markup: '',
			onClick: noop,
			onLoad: noop,
		};
	},

	componentDidMount() {
		this.updateFrameContent( this.props.markup );
	},

	componentDidUpdate() {
		this.updateFrameContent( this.props.markup );
	},

	shouldComponentUpdate( nextProps ) {
		if ( this.hasMarkupChanged( this.props.markup, nextProps.markup ) ) {
			debug( 'markup has changed; re-rendering preview' );
			return true;
		}
		return false;
	},

	hasMarkupChanged( oldMarkup, newMarkup ) {
		return ( oldMarkup !== newMarkup );
	},

	updateFrameContent( content ) {
		debug( 'adding content to iframe', content.length );
		this.iframe.addEventListener( 'load', this.finishPreviewLoad );
		this.iframe.contentDocument.open();
		this.iframe.contentDocument.write( content );
		this.iframe.contentDocument.close();
	},

	finishPreviewLoad() {
		this.props.onLoad( this.iframe.contentDocument );
		const domLinks = Array.prototype.slice.call( this.iframe.contentDocument.querySelectorAll( 'a' ) );
		debug( `disabling ${domLinks.length} links in preview` );
		domLinks.map( this.disableLink );
		this.iframe.contentDocument.body.onclick = this.handleClick;
	},

	disableLink( element ) {
		element.href = '#';
	},

	handleClick( event ) {
		debug( 'click detected for element', event.target );
		this.props.onClick( event );
	},

	saveIframe( el ) {
		this.iframe = el;
	},

	render() {
		return (
			<div className="site-preview">
				<iframe
					className="site-preview-iframe"
					ref={ this.saveIframe }
				/>
			</div>
		);
	}
} );
