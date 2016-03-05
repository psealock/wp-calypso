/**
 * External dependencies
 */
import debugFactory from 'debug';
import wpcom from 'lib/wp';

/**
 * Internal dependencies
 */
import * as ActionTypes from 'state/action-types';

const debug = debugFactory( 'calypso:tailor-actions' );

export function fetchPreviewMarkup( site, slug ) {
	return function( dispatch ) {
		debug( 'fetching preview markup', site, slug );
		wpcom.undocumented().fetchPreviewMarkup( site, slug )
		.then( markup => dispatch( gotMarkup( markup ) ) );
		// TODO: handle errors
	}
}

export function gotMarkup( markup ) {
	return { type: ActionTypes.TAILOR_MARKUP_RECEIVE, markup };
}

export function changePreviewState( previewState ) {
	return { type: ActionTypes.TAILOR_STATE_CHANGE, previewState };
}

export function setSiteSettings( site, newSettings ) {
	return function() {
		debug( 'saving site settings:', newSettings );
		wpcom.undocumented().settings( site, 'post', newSettings, function( error, data ) {
			// TODO: handle errors, notify success
			debug( 'saving site settings complete', error, data );
		} );
	}
}
