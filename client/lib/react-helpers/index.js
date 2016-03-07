/**
 * External dependencies
 */
import ReactDom from 'react-dom';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';

/**
 * Internal dependencies
 */
import { setSection } from 'state/ui/actions';

export default {
	renderWithReduxStore( reactElement, domContainer, reduxStore ) {
		const domContainerNode = ( 'string' === typeof domContainer )
				? document.getElementById( domContainer )
				: domContainer;

		return ReactDom.render(
			React.createElement( ReduxProvider, { store: reduxStore }, reactElement ),
			domContainerNode
		);
	},

	removeSidebarMiddleware( options = {
		section: null,
		isFullScreen: null
	} ) {
		let sectionOptions = {
			hasSidebar: false
		};

		if ( options.isFullScreen !== null ) {
			sectionOptions.isFullScreen = options.isFullScreen;
		}

		// Return the middleware.
		return ( context, next ) => {
			// Remove the sidebar.
			context.secondary = null;

			context.store.dispatch( setSection( options.section, sectionOptions ) );

			next();
		}
	}
};
